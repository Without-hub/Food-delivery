# 🍜 外卖点餐系统 — Food Delivery System

> 一个功能完整的外卖点餐系统，包含用户端移动端页面 + 管理端后台 + RESTful API，支持从浏览店铺到下单评价的全流程。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端框架** | Spring Boot 3.2.0 |
| **ORM** | MyBatis 3.0.3 |
| **数据库** | MySQL 8.0 |
| **用户端前端** | 原生 HTML + CSS + JavaScript（美团风格移动端） |
| **管理端前端** | React 18 + TypeScript + Ant Design 5 + ECharts |
| **构建工具** | Maven 3.6+ / Vite 5 |
| **版本控制** | Git |
| **图片资源** | Unsplash 高清美食图片（本地存储） |

---

## 项目结构

```
food-delivery/
├── src/main/java/com/example/fooddelivery/
│   ├── config/              # 全局异常处理
│   ├── controller/          # 7 个 REST 控制器
│   ├── service/             # 服务接口 + 实现
│   ├── mapper/              # MyBatis 数据访问
│   ├── entity/              # 9 个数据实体
│   └── dto/                 # 数据传输对象
├── src/main/resources/
│   ├── mapper/              # 7 个 MyBatis XML 映射
│   ├── sql/                 # 建表脚本 + 测试数据
│   ├── static/              # 前端静态资源（可直接访问）
│   │   ├── html/            # 8 个前端页面
│   │   ├── css/             # 全局样式
│   │   ├── js/              # 业务逻辑
│   │   └── images/          # 18 张美食图片
│   └── application.yml
├── frontend-user/           # 用户端前端（源文件）
├── admin-frontend/          # 管理端（React + Vite）
└── pom.xml
```

---

## 功能展示

系统采用**美团风格**移动端设计，桌面浏览器打开自动居中显示手机容器框，模拟真实 App 体验。

| 页面 | 功能亮点 |
|------|---------|
| 🏠 **首页** | Banner 轮播、8 个分类导航、双列店铺卡片、浮动购物车角标、搜索过滤 |
| 🏪 **店铺详情** | 店铺信息展示、横向分类 Tab 切换、双列菜品列表、底部已选合计 |
| 🛒 **购物车** | 商品列表、数量加减（减到 1 时自动删除）、清空购物车、底部结算 |
| 📝 **结算页** | 地址选择、**新增地址弹窗**、备注输入、商品清单、价格明细（含配送费） |
| 📋 **订单列表** | 状态筛选 Tab（全部/待付款/已支付/配送中/已完成/已取消）、订单卡片、评价弹窗、配送跟踪入口 |
| 🚚 **配送跟踪** | 进度条动画（已接单→备餐中→配送中→已送达）、虚拟地图、配送员信息、实时状态模拟 |
| 🔑 **登录/注册** | 卡片式设计、渐变背景、表单验证 |

---

## API 接口（共 29 个）

### 用户模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/user/register` | 用户注册 |
| POST | `/user/login` | 用户登录 |
| GET | `/user/info` | 获取用户信息 |
| PUT | `/user/info` | 修改用户信息 |

### 地址模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/address/list` | 地址列表 |
| POST | `/address` | 新增地址 |
| PUT | `/address/{id}` | 修改地址 |
| DELETE | `/address/{id}` | 删除地址 |
| PUT | `/address/default/{id}` | 设置默认地址 |

### 商家模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/shop/list` | 商家列表（分页） |
| GET | `/api/shop/detail` | 商家详情 |
| GET | `/api/shop/filter/category` | 按分类筛选商家 |

### 菜品模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/dish/category/list` | 菜品分类列表 |
| GET | `/api/dish/list` | 菜品分页搜索 |
| GET | `/api/dish/detail` | 菜品详情 |

### 购物车模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cart/list` | 购物车列表（含菜品信息） |
| POST | `/cart/add` | 添加商品 |
| PUT | `/cart/update` | 修改数量 |
| DELETE | `/cart/delete` | 删除商品 |
| DELETE | `/cart/clear` | 清空购物车 |

### 订单模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/orders` | 提交订单（含事务） |
| GET | `/api/orders` | 订单列表（支持状态筛选） |
| GET | `/api/orders/{id}` | 订单详情（含明细） |
| PUT | `/api/orders/{id}/cancel` | 取消订单 |
| PUT | `/api/orders/{id}/status` | 修改订单状态 |

### 评价模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/review/add` | 添加评价 |
| DELETE | `/review/delete` | 删除评价 |
| GET | `/review/dish` | 菜品评价列表 |
| GET | `/review/my` | 我的评价 |
| GET | `/review/rating` | 菜品评分统计 |

---

## 数据库设计（9 张表）

```
user ──→ address    用户拥有多个收货地址
user ──→ cart       用户拥有购物车
user ──→ order      用户提交订单
shop ──→ category   商家拥有多个菜品分类
shop ──→ dish       商家上架菜品
shop ──→ order      订单归属商家
category ──→ dish   菜品属于某个分类
order ──→ order_item 订单包含多个明细
order ──→ review    订单可评价
dish ──→ review     评价关联菜品
```

---

## 快速启动

### 1. 数据库初始化
```sql
-- 在 MySQL 中依次执行
source src/main/resources/sql/schema.sql;
source src/main/resources/sql/test-data.sql;
```

### 2. 启动后端
```bash
mvn spring-boot:run
# 访问 http://localhost:8080
```

### 3. 用户端（已集成到后端）
```
http://localhost:8080/html/login.html
```
测试账号：**testuser** / **123456**

### 4. 管理端
```bash
cd admin-frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

---

## 测试数据

| 类型 | 数量 | 说明 |
|------|------|------|
| 用户 | 2 | testuser（普通用户）、admin（管理员） |
| 商家 | 6 | 老王快餐、张姐小吃、茶百道、首尔炸鸡、一兰拉面、老北京烤鸭 |
| 菜品 | 45+ | 覆盖快餐、小吃、茶饮、炸鸡、日料、中餐六大类 |
| 订单 | 10 | 覆盖待支付、已支付、配送中、已完成、已取消五种状态 |
| 评价 | 6 | 真实用户评价内容 |
| 图片 | 18 | Unsplash 高清美食图 |

---

## 项目总结

本项目从零搭建了一个完整的外卖点餐系统，涵盖以下核心能力：

**后端方面：** 基于 Spring Boot + MyBatis 实现 RESTful API，包含 7 大模块 29 个接口，涉及完整的事务处理（下单扣库存清购物车）、数据关联查询、状态流转控制。

**前端方面：** 用户端采用原生 HTML/CSS/JS 开发美团风格移动端界面，包含 8 个页面（含配送跟踪页），支持地址管理、购物车操作、订单评价等完整交互流程。管理端使用 React + Ant Design 实现数据可视化和后台管理。

**数据库方面：** 设计了 9 张关联表，支持用户、商家、菜品、购物车、订单、评价等实体关系，外键约束保证数据完整性。

**视觉方面：** 配置了 18 张 Unsplash 高清美食图片，桌面端显示手机容器框模拟真实 App 体验。
