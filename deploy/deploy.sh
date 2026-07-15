#!/bin/bash
# ============================================================
# 外卖点餐系统 — Ubuntu 部署脚本
# 使用方法：上传 deploy/ 到服务器后执行：
#   chmod +x deploy.sh && sudo ./deploy.sh
# ============================================================

set -e

# ---- 颜色 ----
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

APP_NAME="food-delivery"
APP_PORT=8080
DB_NAME="food_delivery"
DB_USER="food_user"
DB_PASS="123456"
DEPLOY_DIR="/opt/${APP_NAME}"
SOURCE_DIR="${DEPLOY_DIR}/source"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "$EUID" -ne 0 ]; then
  error "请使用 sudo 运行此脚本"
  exit 1
fi

# ---- 1. 系统更新 + Java 17 ----
info "===== Step 1: 安装 Java 17 ====="
apt-get update -qq
if ! command -v java &>/dev/null; then
  apt-get install -y -qq openjdk-17-jdk unzip
  info "Java 17 已安装"
else
  java -version 2>&1 | head -1
fi

# ---- 2. 安装 Maven ----
info "===== Step 2: 安装 Maven ====="
if ! command -v mvn &>/dev/null; then
  apt-get install -y -qq maven
fi
info "Maven: $(mvn --version 2>&1 | head -1)"

# ---- 3. 初始化 MySQL ----
info "===== Step 3: 初始化数据库 ====="
if ! command -v mysql &>/dev/null; then
  apt-get install -y -qq mysql-server
  # Ubuntu 20.04+ 的 MySQL 默认使用 auth_socket，需改密码
  mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
FLUSH PRIVILEGES;
EOF
  info "MySQL 已安装，root 密码已设为 root123"
fi

# 确保 MySQL 运行中
systemctl start mysql 2>/dev/null || systemctl start mysqld 2>/dev/null || true

# 创建数据库和用户
# 先尝试有密码连接，失败则用 sudo 无密码
if mysql -u root -proot123 -e "SELECT 1" 2>/dev/null; then
  MYSQL_CMD="mysql -u root -proot123"
elif sudo mysql -e "SELECT 1" 2>/dev/null; then
  MYSQL_CMD="sudo mysql"
else
  MYSQL_CMD="mysql -u root"
fi

${MYSQL_CMD} <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

# 导入数据
if [ -f "${SCRIPT_DIR}/schema.sql" ]; then
  mysql -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" < "${SCRIPT_DIR}/schema.sql"
  info "✅ 表结构已导入"
fi
if [ -f "${SCRIPT_DIR}/test-data.sql" ]; then
  mysql -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" < "${SCRIPT_DIR}/test-data.sql"
  info "✅ 测试数据已导入（6家店 + 45道菜 + 10个订单）"
fi

# ---- 4. 编译项目 ----
info "===== Step 4: 编译项目 ====="
mkdir -p "${SOURCE_DIR}"
if [ -f "${SCRIPT_DIR}/food-delivery-source.zip" ]; then
  unzip -o "${SCRIPT_DIR}/food-delivery-source.zip" -d "${SOURCE_DIR}/" > /dev/null
  info "源码已解压到 ${SOURCE_DIR}"
fi

cd "${SOURCE_DIR}"
mvn clean package -DskipTests -q
JAR_FILE=$(find target -name "*.jar" -type f | head -1)
if [ -z "${JAR_FILE}" ]; then
  error "编译失败，请检查错误日志"
  exit 1
fi
info "✅ JAR 编译完成: $(basename ${JAR_FILE})"

# ---- 5. 部署为 systemd 服务 ----
info "===== Step 5: 注册系统服务 ====="
mkdir -p "${DEPLOY_DIR}"
cp "${JAR_FILE}" "${DEPLOY_DIR}/${APP_NAME}.jar"

cat > /etc/systemd/system/${APP_NAME}.service <<UNIT
[Unit]
Description=Food Delivery API Server
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=${DEPLOY_DIR}
ExecStart=/usr/bin/java -jar ${DEPLOY_DIR}/${APP_NAME}.jar --spring.profiles.active=prod
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable ${APP_NAME}
systemctl restart ${APP_NAME}
info "✅ 后端服务已启动 (端口 ${APP_PORT})"

# ---- 6. 配置 Nginx 反向代理 ----
info "===== Step 6: 配置 Nginx ====="
if ! command -v nginx &>/dev/null; then
  apt-get install -y -qq nginx
fi

if [ -f "${SCRIPT_DIR}/nginx.conf" ]; then
  cp "${SCRIPT_DIR}/nginx.conf" /etc/nginx/sites-available/${APP_NAME}
  ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx && info "✅ Nginx 已重载" || warn "Nginx 配置有误，请检查"
fi

# ---- 7. 验证 ----
info "===== Step 7: 验证部署 ====="
sleep 5
if systemctl is-active --quiet ${APP_NAME}; then
  info "✅ 后端服务运行正常 ✓"
  curl -s http://localhost:${APP_PORT}/api/shop/list 2>/dev/null | head -1 && info "✅ API 响应正常"
else
  error "❌ 服务启动失败，查看日志: journalctl -u ${APP_NAME} -n 50 --no-pager"
fi

# ---- 完成 ----
echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "后端 API:   http://localhost:${APP_PORT}"
echo "外部访问:   https://without.net.cn/api/..."
echo ""
echo "查看日志:   journalctl -u ${APP_NAME} -f"
echo "重启服务:   systemctl restart ${APP_NAME}"
echo "=========================================="
