# 外卖点餐系统 — 课程设计

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 3.2.0 |
| ORM | MyBatis 3.0.3 |
| 数据库 | MySQL 8.0 |
| 前端 | HTML + CSS + JavaScript + ECharts |
| 构建工具 | Maven 3.6+ |
| 版本控制 | Git (Gitee) |

## 项目结构（五层架构）

```
food-delivery/
├── src/main/java/com/example/fooddelivery/
│   ├── controller/        # 控制层
│   ├── service/           # 服务接口层
│   │   └── impl/          # 服务实现层
│   ├── mapper/            # 数据访问层
│   ├── entity/            # 实体层
│   └── dto/               # 数据传输对象
├── src/main/resources/
│   ├── mapper/            # MyBatis XML 映射文件
│   ├── sql/               # 数据库脚本
│   └── application.yml    # 配置
└── pom.xml
```

## Git 协作规范

### 分支策略

```
main ← dev ← feature-xxx
```

- `main` — 稳定版本（仅组长合并）
- `dev` — 开发主分支
- `feature-order` — 订单模块（魏子皓）
- `feature-user` — 用户模块 + 地址管理（李享洋）
- `feature-shop` — 商家模块 + 菜品模块（毛帅）
- `feature-cart` — 购物车模块（赵涵）
- `feature-review` — 评价模块（赵涵）
- `feature-front-user` — 用户端前端（张一风）
- `feature-front-admin` — 管理端前端（黄金麟）

### 工作流程

1. 克隆仓库：`git clone https://gitee.com/wi-without/online-food-ordering-system.git`
2. 切换到自己的功能分支：`git checkout feature-xxx`
3. 开发完成后提交：`git add . && git commit -m "[模块] 操作描述"`
4. 推送分支：`git push origin feature-xxx`
5. 在 Gitee 上向 `dev` 分支发起 Pull Request
6. 组长审查后合并

### 提交规范

格式：`[模块] 操作描述`

示例：
- `[order] 完成下单事务逻辑`
- `[user] 实现登录注册接口`
- `[shop] 添加商家分页查询`

## 开发任务清单

### 已完成
- [x] 项目骨架搭建（pom.xml、配置、五层架构）
- [x] 数据库设计（9 张表建表脚本）
- [x] 全部 Entity 实体类
- [x] 订单模块后端（下单事务、状态流转、历史查询）
- [x] Git 仓库初始化与分支创建

### 待完成 — 后端

| 模块 | 负责人 | 状态 |
|------|--------|------|
| 用户模块（注册/登录/信息修改） | 李享洋 | 🔲 待开发 |
| 地址管理（增删改查/默认地址） | 李享洋 | 🔲 待开发 |
| 商家模块（列表/详情/筛选） | 毛帅 | 🔲 待开发 |
| 菜品模块（分类/分页/搜索） | 毛帅 | 🔲 待开发 |
| 购物车模块（添加/修改/删除/清空） | 赵涵 | 🔲 待开发 |
| 评价模块（添加评价/列表/评分） | 赵涵 | 🔲 待开发 |
| ~~订单模块~~ | ~~魏子皓~~ | ✅ 已完成 |

### 待完成 — 前端

| 页面 | 负责人 | 状态 |
|------|--------|------|
| 登录/注册页 | 张一风 | 🔲 待开发 |
| 首页（商家推荐/分类导航） | 张一风 | 🔲 待开发 |
| 商家详情页 | 张一风 | 🔲 待开发 |
| 购物车页 | 张一风 | 🔲 待开发 |
| 下单页 | 张一风 | 🔲 待开发 |
| 订单列表页 | 张一风 | 🔲 待开发 |
| 管理后台首页 | 黄金麟 | 🔲 待开发 |
| 用户管理页 | 黄金麟 | 🔲 待开发 |
| 订单管理页 | 黄金麟 | 🔲 待开发 |
| 数据统计页（ECharts） | 黄金麟 | 🔲 待开发 |
| 全局样式/公共组件 | 黄金麟 | 🔲 待开发 |

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

## 快速启动

1. 导入 `src/main/resources/sql/schema.sql` 到 MySQL
2. 修改 `application.yml` 中的数据库连接信息
3. IDEA 中打开项目，Maven 自动下载依赖
4. 运行 `FoodDeliveryApplication.java`
5. 访问 `http://localhost:8080`

## API 接口（已完成）

### 订单模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/orders` | 提交订单 |
| GET | `/api/orders?status=0` | 订单列表（可选状态筛选） |
| GET | `/api/orders/{id}` | 订单详情（含明细） |
| PUT | `/api/orders/{id}/cancel` | 取消订单 |
| PUT | `/api/orders/{id}/status?status=1` | 修改订单状态（管理端） |
