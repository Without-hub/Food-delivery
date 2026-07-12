# 🍜 外卖点餐系统 — Food Delivery System

> 一个功能完整的外卖点餐系统，包含用户端移动端页面 + 管理端后台 + RESTful API，支持从浏览店铺到下单评价的全流程。
>
> **🌟 已集成安全加固：** Spring Security + JWT Token 认证 + BCrypt 密码加密
> **🌟 已优化代码质量：** Lombok 简化、统一构造器注入、单元测试覆盖

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端框架** | Spring Boot 3.2.0 |
| **ORM** | MyBatis 3.0.3 |
| **数据库** | MySQL 8.0 |
| **安全认证** | Spring Security + JWT (jjwt 0.12.5) + BCryptPasswordEncoder |
| **用户端前端** | 原生 HTML + CSS + JavaScript（美团风格移动端） |
| **管理端前端** | React 18 + TypeScript + Ant Design 5 + ECharts |
| **构建工具** | Maven 3.6+ / Vite 5 |
| **测试框架** | JUnit 5 + Mockito |
| **版本控制** | Git |

---

## 项目结构

```
food-delivery/
├── src/main/java/com/example/fooddelivery/
│   ├── config/              # 安全配置 + JWT + 全局异常处理
│   │   ├── SecurityConfig.java      # Spring Security 配置
│   │   ├── JwtUtil.java             # JWT 工具类（生成/解析 Token）
│   │   ├── JwtAuthFilter.java       # JWT 认证过滤器
│   │   ├── UserPrincipal.java       # 认证用户主体
│   │   ├── SecurityUtil.java        # 安全上下文工具
│   │   └── GlobalExceptionHandler.java
│   ├── controller/          # 17 个 REST 控制器（含 9 个管理端）
│   ├── service/             # 服务接口 + 实现
│   ├── mapper/              # 9 个 MyBatis 数据访问接口
│   ├── entity/              # 9 个数据实体（Lombok 简化）
│   └── dto/                 # 11 个数据传输对象（Lombok 简化）
├── src/main/resources/
│   ├── mapper/              # 9 个 MyBatis XML 映射
│   ├── static/              # 前端静态资源（可直接访问）
│   │   ├── html/            # 8 个前端页面
│   │   ├── css/             # 全局样式
│   │   ├── js/              # 业务逻辑
│   │   └── images/          # 18 张美食图片
│   └── application.yml
├── src/test/java/           # 单元测试
│   └── UserServiceTest.java
├── frontend-user/           # 用户端前端（源文件）
├── admin-frontend/          # 管理端（React + Vite + Ant Design）
├── schema.sql               # 建表脚本
├── test-data.sql            # 测试数据
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
| 🔑 **登录/注册** | 卡片式设计、渐变背景、表单验证、JWT 自动登录 |

---

## API 接口（共 50+ 个）

### 用户端 API

#### 用户模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/user/register` | 用户注册（BCrypt 加密存储） |
| POST | `/user/login` | 用户登录（返回 JWT Token） |
| GET | `/user/info` | 获取用户信息（需 Token） |
| PUT | `/user/info` | 修改用户信息（需 Token） |

#### 认证模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 管理端登录（返回 JWT Token） |
| GET | `/api/auth/current-user` | 获取当前登录用户（需 Token） |

#### 地址模块、商家模块、菜品模块、购物车模块、订单模块、评价模块
> 所有接口均需在请求头携带 `Authorization: Bearer <token>`

### 管理端 API（`/api/admin/`）
> 仅 `role=1`（管理员）可访问，需 JWT Token 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/dashboard/stats` | 数据概览 |
| GET | `/api/admin/orders` | 订单列表（分页） |
| GET | `/api/admin/orders/{id}` | 订单详情 |
| DELETE | `/api/admin/orders/{id}` | 删除订单 |
| GET | `/api/admin/dishes` | 菜品列表（分页） |
| POST | `/api/admin/dishes` | 新增菜品 |
| PUT | `/api/admin/dishes/{id}` | 修改菜品 |
| DELETE | `/api/admin/dishes/{id}` | 删除菜品 |
| GET | `/api/admin/categories` | 分类列表 |
| POST | `/api/admin/categories` | 新增分类 |
| PUT | `/api/admin/categories/{id}` | 修改分类 |
| DELETE | `/api/admin/categories/{id}` | 删除分类 |
| GET | `/api/admin/users` | 用户列表（分页） |
| PATCH | `/api/admin/users/{id}/status` | 修改用户状态 |
| GET | `/api/admin/shops` | 商家列表（分页） |
| PATCH | `/api/admin/shops/{id}/status` | 修改商家状态 |
| GET | `/api/admin/reviews` | 评价列表（分页） |
| PUT | `/api/admin/reviews/{id}/reply` | 回复评价 |
| DELETE | `/api/admin/reviews/{id}` | 删除评价 |
| GET | `/api/admin/deliveries` | 配送管理列表 |
| PUT | `/api/admin/deliveries/{id}/status` | 更新配送状态 |
| GET | `/api/admin/statistics/summary` | 统计概览（订单/营收/用户/商家） |
| GET | `/api/admin/statistics/revenue-trend` | 近7日营收趋势 |
| GET | `/api/admin/statistics/order-status-distribution` | 订单状态分布 |
| GET | `/api/admin/statistics/top-dishes` | 热销菜品排行 |
| GET | `/api/admin/statistics/shop-rankings` | 商家排行 |

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

## 🔒 安全机制

### 认证流程
1. **用户注册** → 密码经 `BCryptPasswordEncoder` 加密后存储
2. **用户登录** → 验证密码通过后，返回 JWT Token（含 userId + role）
3. **请求鉴权** → `JwtAuthFilter` 从 `Authorization` 请求头解析 Token
4. **角色控制** → `SecurityConfig` 配置：`/api/admin/**` 需要 `ROLE_ADMIN`
5. **用户身份** → 所有 Controller 通过 `SecurityUtil.getCurrentUserId()` 获取当前用户

### 安全特性
- ✅ 密码 BCrypt 加密存储（不可逆哈希）
- ✅ JWT Token 无状态认证（24h 过期）
- ✅ 管理端 API 角色隔离（`ROLE_ADMIN`）
- ✅ 全局异常处理 + 统一响应格式

---

## 快速启动

### 1. 数据库初始化
```sql
-- 在 MySQL 中依次执行（建表脚本在项目根目录）
source schema.sql;
source test-data.sql;
```

### 2. 配置数据库连接
编辑 `src/main/resources/application.yml`，修改数据库用户名和密码：
```yaml
spring:
  datasource:
    username: your-username
    password: your-password
```

默认 JWT 密钥（生产环境请更换）：
```yaml
jwt:
  secret: food*************************
  expiration: 86400000  # 24小时
```

### 3. 启动后端
```bash
mvn spring-boot:run
# 访问 http://localhost:8080
```

### 4. 用户端（已集成到后端）
```
http://localhost:8080/html/login.html
```
测试账号：**testuser** / **123456**

### 5. 管理端
```bash
cd admin-frontend
npm install
npm run dev
# 访问 http://localhost:3000（如端口冲突，默认 fallback 到 5173）
```
管理端登录账号：**admin** / **admin123**

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

## 项目优化日志

| 版本 | 优化内容 |
|------|---------|
| v2.0 | 🔐 集成 Spring Security + JWT 认证体系 |
| | 🔑 密码 BCrypt 加密存储，替换明文存储 |
| | 🛡️ 管理端 API 角色鉴权，仅管理员可访问 |
| | 🆔 所有 Controller 替换硬编码 userId，从 Token 解析 |
| | 🐛 修复 nickname 赋值 bug、订单全表查询性能问题 |
| | 🧪 添加核心服务 JUnit 5 单元测试 |
| | 📦 所有 Entity/DTO 改用 Lombok @Data 简化 |
| | 🔧 统一构造器注入、修复 javax/jakarta 包混用 |

---

## 项目总结

本项目从零搭建了一个完整的外卖点餐系统，涵盖以下核心能力：

**后端方面：** 基于 Spring Boot + MyBatis + Spring Security 实现安全 RESTful API，包含 17 个控制器 50+ 个接口，支持 JWT 无状态认证和基于角色的访问控制。涉及完整的事务处理（下单扣库存清购物车）、数据关联查询、状态流转控制。

**安全方面：** 全面重构认证体系，密码 BCrypt 加密存储、JWT Token 认证、管理端 API 角色隔离，所有用户身份从 Token 安全解析，不再硬编码或依赖客户端传入。

**前端方面：** 用户端采用原生 HTML/CSS/JS 开发美团风格移动端界面，包含 8 个页面（含配送跟踪页），支持地址管理、购物车操作、订单评价等完整交互流程。管理端使用 React + TypeScript + Ant Design 5 + ECharts 实现数据可视化和后台管理。

**质量方面：** 引入单元测试框架，使用 Lombok 简化实体/DTO 样板代码，统一使用构造器注入，提升代码可维护性和可测试性。
