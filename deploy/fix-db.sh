#!/bin/bash
# 修复数据库初始化问题 — 在服务器上运行
# 使用方法：在 deploy/ 目录下执行 bash fix-db.sh

cd "$(dirname "$0")"

# 先用 root 创建数据库（试试不同密码）
echo "尝试创建数据库 food_delivery..."

# 方法1: 带密码
mysql -u root -proot123 -e "
CREATE DATABASE IF NOT EXISTS food_delivery DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'food_user'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON food_delivery.* TO 'food_user'@'localhost';
FLUSH PRIVILEGES;
" 2>/dev/null && echo "✅ 方法1成功" || {

  # 方法2: 无密码（sudo mysql）
  sudo mysql -e "
  CREATE DATABASE IF NOT EXISTS food_delivery DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'food_user'@'localhost' IDENTIFIED BY '123456';
  GRANT ALL PRIVILEGES ON food_delivery.* TO 'food_user'@'localhost';
  FLUSH PRIVILEGES;
  " 2>/dev/null && echo "✅ 方法2成功" || {

    echo "❌ 创建失败，请手动执行："
    echo "  sudo mysql"
    echo "  然后在 MySQL 中执行以下命令："
    echo "  CREATE DATABASE food_delivery DEFAULT CHARSET utf8mb4;"
    echo "  CREATE USER 'food_user'@'localhost' IDENTIFIED BY '123456';"
    echo "  GRANT ALL ON food_delivery.* TO 'food_user'@'localhost';"
    exit 1
  }
}

# 导入数据
echo "正在导入 schema.sql..."
mysql -u food_user -p123456 food_delivery < schema.sql && echo "✅ 表结构导入成功"

echo "正在导入 test-data.sql..."
mysql -u food_user -p123456 food_delivery < test-data.sql && echo "✅ 测试数据导入成功"

echo ""
echo "====== 数据库初始化完成 ======"
echo "接下来执行剩下的部署步骤："
echo "  1. cd /home/ubuntu/deploy"
echo "  2. cd source && mvn clean package -DskipTests"
echo "  3. sudo cp target/*.jar /opt/food-delivery/"
echo "  4. sudo systemctl restart food-delivery"
