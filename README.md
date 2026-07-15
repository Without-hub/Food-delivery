# 🍜 外卖点餐系统 — Food Delivery System

> 完整的外卖点餐系统：**微信小程序用户端** + **管理端后台** + **RESTful API**，支持从浏览店铺到下单评价的全流程。
>
> **🌟 安全加固：** Spring Security + JWT Token 认证 + BCrypt 密码加密
> **🌟 小程序端：** 原生微信小程序，12 个页面覆盖完整点餐体验
> **🌟 管理后台：** React + Ant Design + ECharts 数据可视化

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端框架** | Spring Boot 3.2.0 + MyBatis 3.0.3 + MySQL 8.0 |
| **安全认证** | Spring Security + JWT (jjwt 0.12.5) + BCryptPasswordEncoder |
| **管理端前端** | React 18 + TypeScript + Ant Design 5 + ECharts |
| **微信小程序** | 原生小程序（WXML + WXSS + JavaScript） |
| **构建工具** | Maven 3.6+ / Vite 5 |
| **部署** | Nginx 反向代理 + systemd 服务 |

---

## 项目结构

```
food-delivery/
├── src/main/java/com/example/fooddelivery/
│   ├── config/              # 安全配置 + JWT + 全局异常处理
│   ├── controller/          # 17 个 REST 控制器
│   ├── service/             # 服务接口 + 实现
│   ├── mapper/              # 9 个 MyBatis 数据访问接口
│   ├── entity/              # 9 个数据实体
│   └── dto/                 # 11 个数据传输对象
├── src/main/resources/
│   ├── mapper/              # 9 个 MyBatis XML 映射
│   └── static/              # 前端静态资源（html/css/js/图片）
├── admin-frontend/          # 🖥️ 管理端（React + Vite + Ant Design）
├── miniapp-user/            # 📱 微信小程序用户端（12 个页面）
├── deploy/                  # 📦 服务器部署包
│   ├── deploy.sh            # 一键部署脚本
│   ├── nginx.conf           # Nginx 反向代理配置
│   ├── schema.sql           # 数据库建表脚本
│   └── test-data.sql        # 测试数据
├── schema.sql               # 数据库表结构
└── test-data.sql            # 测试数据
```

---

## 📱 微信小程序（miniapp-user/）

### 小程序页面

| 页面 | 功能 |
|------|------|
| **首页** | Banner 轮播、分类导航、商家列表、搜索、浮动购物车 |
| **店铺详情** | 菜品分类 Tab、菜品列表、加购、购物车弹窗 |
| **购物车** | 数量加减、清空、结算 |
| **结算页** | 地址选择、商品清单、备注、提交订单 |
| **订单列表** | 状态筛选（全部/待支付/已支付/配送中/已完成/已取消） |
| **订单详情** | 订单进度、菜品清单、评价 |
| **配送追踪** | 进度条、骑手信息、联系骑手 |
| **登录 / 注册** | 账号密码登录、手机号注册 |
| **地址管理** | 地址列表、新增/编辑地址、设为默认 |
| **个人中心** | 用户信息、订单入口、地址管理、退出登录 |

### 小程序配置

API 地址在 `miniapp-user/utils/request.js` 中配置：
```js
const BASE_URL = 'https://without.net.cn';
```

图片通过 WXS 模块从服务器加载：
```js
// utils/img.wxs
var SERVER = 'https://without.net.cn';
```

---

## 🖥️ 管理后台（admin-frontend/）

### 功能模块

| 页面 | 路径 | 功能 |
|------|------|------|
| 数据概览 | `/admin/dashboard` | 订单/营收/用户/商家统计图表 |
| 订单管理 | `/admin/orders` | 订单列表、详情、状态管理 |
| 菜品管理 | `/admin/dishes` | 菜品 CRUD、分类管理 |
| 分类管理 | `/admin/categories` | 菜品分类 |
| 用户管理 | `/admin/users` | 用户列表、状态管理 |
| 商家管理 | `/admin/shops` | 商家列表、详情 |
| 配送管理 | `/admin/delivery` | 配送状态跟踪 |
| 评价管理 | `/admin/reviews` | 评价回复、删除 |
| 数据统计 | `/admin/statistics` | 营收趋势、订单分布、热销菜品 |

---

## 🌐 后端 API

### 用户端 API（共 50+ 个）

| 模块 | 接口 | 说明 |
|------|------|------|
| **用户** | `POST /user/register` | 注册（BCrypt 加密） |
| | `POST /user/login` | 登录（返回 JWT Token） |
| | `GET /user/info` | 获取用户信息 |
| **商家** | `GET /api/shop/list` | 商家列表 |
| | `GET /api/shop/detail` | 商家详情 |
| **菜品** | `GET /api/dish/list` | 菜品列表 |
| | `GET /api/dish/category/list` | 菜品分类 |
| **购物车** | `POST /cart/add` | 加购 |
| | `GET /cart/list` | 购物车列表 |
| | `PUT /cart/update` | 修改数量 |
| | `DELETE /cart/delete` | 删除商品 |
| | `DELETE /cart/clear` | 清空购物车 |
| **订单** | `POST /api/orders` | 创建订单 |
| | `GET /api/orders` | 订单列表 |
| | `GET /api/orders/{id}` | 订单详情 |
| | `PUT /api/orders/{id}/cancel` | 取消订单 |
| **地址** | `POST /address` | 新增地址 |
| | `GET /address/list` | 地址列表 |
| | `PUT /address/{id}` | 修改地址 |
| | `DELETE /address/{id}` | 删除地址 |
| **评价** | `POST /review/add` | 添加评价 |
| | `GET /review/dish` | 菜品评价列表 |

---

## 🚀 服务器部署指南

### 环境要求

- **服务器**：Ubuntu 20.04+
- **Java**：OpenJDK 17+
- **MySQL**：8.0+
- **Nginx**：最新版
- **Maven**：3.6+
- **Node.js**：18+（编译管理端用）

### 一键部署

将 `deploy/` 目录上传到服务器后执行：

```bash
cd deploy
chmod +x deploy.sh
sudo ./deploy.sh
```

脚本会自动完成：
1. 安装 Java 17、Maven、MySQL、Nginx
2. 创建数据库 `food_delivery` 和用户 `food_user`
3. 导入表结构和测试数据（6 家店铺、45 道菜、10 个订单）
4. 编译后端源码 → 生成 JAR → 注册 systemd 服务
5. 配置 Nginx 反向代理

> 如有 SSL 证书，将 `.pem` 和 `.key` 文件放到 `/etc/nginx/ssl/` 目录。

### 手动部署步骤

```bash
# 1. 安装依赖
sudo apt-get install -y openjdk-17-jdk maven mysql-server nginx

# 2. 初始化数据库
mysql -u root -e "CREATE DATABASE food_delivery DEFAULT CHARACTER SET utf8mb4;"
mysql -u root -e "CREATE USER 'food_user'@'localhost' IDENTIFIED BY '123456';"
mysql -u root -e "GRANT ALL ON food_delivery.* TO 'food_user'@'localhost';"
mysql -u food_user -p123456 food_delivery < schema.sql
mysql -u food_user -p123456 food_delivery < test-data.sql

# 3. 编译后端
mvn clean package -DskipTests
sudo cp target/food-delivery-*.jar /opt/food-delivery/food-delivery.jar

# 4. 配置服务
sudo tee /etc/systemd/system/food-delivery.service << EOF
[Unit]
Description=Food Delivery API Server
After=network.target mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/food-delivery
ExecStart=/usr/bin/java -jar /opt/food-delivery/food-delivery.jar --spring.profiles.active=prod
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload && sudo systemctl enable food-delivery
sudo systemctl restart food-delivery

# 5. 配置 Nginx
sudo cp deploy/nginx.conf /etc/nginx/conf.d/food-delivery.conf
sudo nginx -t && sudo systemctl reload nginx
```

### 管理前端部署

```bash
cd admin-frontend
npm install
npm run build
sudo cp -r dist/* /var/www/admin/
```

访问 `https://your-domain/admin/`

### 小程序配置

修改 `miniapp-user/utils/request.js` 中的 BASE_URL 为你的服务器域名。

---

## 🔒 安全机制

| 机制 | 说明 |
|------|------|
| **密码加密** | BCryptPasswordEncoder 不可逆哈希 |
| **JWT 认证** | 无状态 Token，24 小时过期 |
| **角色鉴权** | 管理端 API 需 `ROLE_ADMIN` |
| **CORS** | 已配置跨域支持 |

---

## 🧪 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 普通用户 | testuser | 123456 |
| 管理员 | admin | admin123 |

---

## 📦 部署包（deploy/）

| 文件 | 说明 |
|------|------|
| `deploy.sh` | Ubuntu 一键部署脚本 |
| `nginx.conf` | Nginx HTTPS + API 反向代理配置 |
| `food-delivery-source.zip` | 后端 Java 源码 |
| `schema.sql` | 数据库建表脚本（9 张表） |
| `test-data.sql` | 测试数据 |
| `admin-dist/` | 编译好的管理端静态文件 |

---

## 更新日志

### v2.0 — 全面升级
- 🔐 集成 Spring Security + JWT 认证体系
- 🔑 密码 BCrypt 加密存储
- 🛡️ 管理端 API 角色鉴权
- 📱 新增微信小程序用户端（12 个页面）
- 🖥️ 管理端后台（React + Ant Design + ECharts）
- 📋 Spring Profile 配置（dev/prod 环境分离）
- 🔢 雪花算法生成订单号
- 🖼️ Nginx 反向代理 + HTTPS
