# 外卖点餐系统 — 课程设计

> **当前状态**：全部模块已完成开发与合并，集成测试通过率 100%（26/26 接口），前端功能完整可用

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 3.2.0 |
| ORM | MyBatis 3.0.3 |
| 数据库 | MySQL 8.0 |
| 用户端前端 | HTML + CSS + JavaScript（原生） |
| 管理端前端 | React 18 + TypeScript + Ant Design 5 + ECharts |
| 构建工具 | Maven 3.6+ / Vite 5 |
| 版本控制 | Git (Gitee) |

## 项目结构

```
food-delivery/
├── src/main/java/com/example/fooddelivery/
│   ├── config/             # 配置类
│   ├── controller/         # 控制层（7 个 Controller）
│   ├── service/            # 服务接口层
│   │   └── impl/           # 服务实现层
│   ├── mapper/             # 数据访问层
│   ├── entity/             # 实体层（9 个 Entity）
│   └── dto/                # 数据传输对象
├── src/main/resources/
│   ├── mapper/             # MyBatis XML 映射（7 个）
│   ├── sql/                # 数据库脚本（schema + test-data）
│   └── application.yml
├── frontend-user/          # 用户端（7 个页面）
│   ├── html/
│   ├── css/
│   └── js/
├── admin-frontend/         # 管理端（React + Vite）
│   ├── src/
│   │   ├── api/            # API 请求层
│   │   ├── pages/          # 11 个页面
│   │   ├── layouts/        # 布局组件
│   │   ├── store/          # 状态管理（Zustand）
│   │   └── utils/          # 工具函数
│   └── package.json
└── pom.xml
```

## UI 展示

系统采用**美团风格**移动端设计，桌面打开自动居中显示手机容器框：

| 页面 | 功能 |
|------|------|
| 🏠 **首页** | Banner轮播、分类导航、双列店铺卡片、浮动购物车角标 |
| 🏪 **店铺详情** | 店铺信息、横向分类Tab、双列菜品列表、底部已选合计 |
| 🛒 **购物车** | 商品列表、数量加减、清空、结算 |
| 📝 **结算页** | 地址选择、新增地址、备注、商品清单、价格明细 |
| 📋 **订单列表** | 状态筛选Tab、订单卡片(缩略图)、评价弹窗、配送跟踪入口 |
| 🚚 **配送跟踪** | 进度条动画、虚拟地图、配送员信息、实时状态模拟 |

所有图片使用 Unsplash 高清美食图片，本地存储于 `/images/` 目录。

## 快速启动

### 1. 数据库
```sql
-- 在 MySQL 中执行
source src/main/resources/sql/schema.sql;
source src/main/resources/sql/test-data.sql;
```

### 2. 后端
```bash
# IDEA 中运行 FoodDeliveryApplication.java
# 或命令行
mvn spring-boot:run
# 启动后访问 http://localhost:8080
```

### 3. 用户端前端（已集成到 Spring Boot）
前端文件已放入 `src/main/resources/static/`，启动后端后直接访问：
```
http://localhost:8080/html/login.html
```
测试账号：`testuser` / `123456`

### 4. 管理端前端
```bash
cd admin-frontend
npm install
npm run dev
# 浏览器访问 http://localhost:5173
```

## Git 协作规范

### 分支策略

```
main ← dev ← feature-xxx
```

| 分支 | 负责人 | 模块 | 状态 |
|------|--------|------|------|
| `feature-order` | 魏子皓（组长） | 订单模块 | ✅ 已合并 |
| `feature-user` | 李享洋 | 用户模块 + 地址管理 | ✅ 已合并 |
| `feature-shop` | 毛帅 | 商家模块 + 菜品模块 | ✅ 已合并 |
| `feature-cart` | 赵涵 | 购物车模块 | ✅ 已合并 |
| `feature-review` | 赵涵 | 评价模块 | ✅ 已合并 |
| `feature-front-user` | 张一风 | 用户端前端 7 页 | ✅ 已合并 |
| `feature-front-admin` | 黄金麟 | 管理端前端 | ✅ 已合并 |

### 工作流程

1. 克隆仓库：`git clone https://gitee.com/wi-without/online-food-ordering-system.git`
2. 切换到自己的功能分支：`git checkout feature-xxx`
3. 开发完成后提交：`git add . && git commit -m "[模块] 操作描述"`
4. 推送分支：`git push origin feature-xxx`
5. 在 Gitee 上向 `dev` 分支发起 Pull Request
6. 组长审查后合并

### 提交规范

格式：`[模块] 操作描述`，如 `[order] 完成下单事务逻辑`

---

## 开发任务清单

### 后端模块（全部完成）

| 模块 | 负责人 | 接口数 | 状态 |
|------|--------|--------|------|
| 订单模块 | 魏子皓 | 5 | ✅ |
| 用户模块 | 李享洋 | 3 | ✅ |
| 地址管理 | 李享洋 | 5 | ✅ |
| 商家模块 | 毛帅 | 3 | ✅ |
| 菜品模块 | 毛帅 | 3 | ✅ |
| 购物车模块 | 赵涵 | 5 | ✅ |
| 评价模块 | 赵涵 | 5 | ✅ |

### 前端页面（全部完成）

**用户端（张一风）— 7 页**

| 页面 | 文件 | 状态 |
|------|------|------|
| 登录 | login.html | ✅ |
| 注册 | register.html | ✅ |
| 首页 | index.html | ✅ |
| 商家详情 | shop.html | ✅ |
| 购物车 | cart.html | ✅ |
| 下单确认 | order.html | ✅ |
| 订单列表 | order-list.html | ✅ |
| 配送跟踪 | tracking.html | ✅ |

**管理端（黄金麟）— 4 核心页 + 7 扩展页**

| 页面 | 路由 | 状态 |
|------|------|------|
| 数据概览 | /dashboard | ✅ |
| 用户管理 | /users | ✅ |
| 订单管理 | /orders | ✅ |
| 数据统计 | /statistics（含 ECharts） | ✅ |

---

## 数据库表（9 张）

| 表名 | 说明 | 外键关系 |
|------|------|----------|
| `user` | 用户表 | — |
| `shop` | 商家表 | — |
| `category` | 菜品分类表 | `shop_id` → shop |
| `dish` | 菜品表 | `shop_id` → shop, `category_id` → category |
| `cart` | 购物车表 | `user_id` → user, `dish_id` → dish |
| `address` | 收货地址表 | `user_id` → user |
| `order` | 订单表 | `user_id` → user, `address_id` → address, `shop_id` → shop |
| `order_item` | 订单明细表 | `order_id` → order, `dish_id` → dish |
| `review` | 评价表 | `user_id` → user, `order_id` → order, `dish_id` → dish |

---

## API 接口文档

### 用户模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/user/register` | 用户注册 |
| POST | `/user/login` | 用户登录 |
| GET | `/user/info` | 获取用户信息（Header: userId） |
| PUT | `/user/info` | 修改用户信息（Header: userId） |

### 地址模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/address/list` | 地址列表（Header: userId） |
| POST | `/address` | 新增地址 |
| PUT | `/address/{id}` | 修改地址 |
| DELETE | `/address/{id}` | 删除地址 |
| PUT | `/address/default/{id}` | 设置默认地址 |

### 商家模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/shop/list` | 商家列表 |
| GET | `/api/shop/detail?shopId=` | 商家详情 |
| GET | `/api/shop/filter/category?categoryId=` | 按分类筛选 |

### 菜品模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/dish/category/list?shopId=` | 菜品分类列表 |
| GET | `/api/dish/list?shopId=&pageNum=&pageSize=` | 菜品分页搜索 |
| GET | `/api/dish/detail?dishId=` | 菜品详情 |

### 购物车模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cart/list?userId=` | 购物车列表 |
| POST | `/cart/add` | 添加商品 |
| PUT | `/cart/update` | 修改数量 |
| DELETE | `/cart/delete?id=` | 删除商品 |
| DELETE | `/cart/clear?userId=` | 清空购物车 |

### 订单模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/orders` | 提交订单（下单事务） |
| GET | `/api/orders` | 订单列表 |
| GET | `/api/orders/{id}` | 订单详情（含明细） |
| PUT | `/api/orders/{id}/cancel` | 取消订单 |
| PUT | `/api/orders/{id}/status?status=` | 修改订单状态 |

### 评价模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/review/add` | 添加评价 |
| DELETE | `/review/delete` | 删除评价 |
| GET | `/review/dish?dishId=` | 菜品评价列表 |
| GET | `/review/my?userId=` | 我的评价 |
| GET | `/review/rating?dishId=` | 菜品评分计算 |

---

## 测试数据

| 账号 | 用户名 | 密码 | 角色 |
|------|--------|------|------|
| 测试用户 | testuser | 123456 | 普通用户 |
| 管理员 | admin | 123456 | 管理员 |

测试商家（6 家）：老王快餐、张姐小吃、茶百道、首尔炸鸡、一兰拉面、老北京烤鸭
测试订单（10 个）：覆盖待支付、已支付、配送中、已完成、已取消五种状态

---

## 项目进度

| 阶段 | 状态 |
|------|------|
| 项目架构搭建 | ✅ 已完成 |
| 数据库设计 | ✅ 已完成 |
| 后端模块开发（29 个 API） | ✅ 已完成 |
| 前端页面开发（用户端 7 + 管理端 11） | ✅ 已完成 |
| 代码审查与修复 | ✅ 已完成 |
| 分支合并 | ✅ 已完成 |
| 集成测试 | ✅ 已完成（24/24 通过） |
| 前端功能完善（分类/地址新增/评价） | ✅ 已完成 |
| 课程设计报告 | 🔲 进行中 |
| 答辩准备 | 🔲 待进行 |
