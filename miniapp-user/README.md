# 🍜 外卖点餐系统 — 微信小程序用户端

基于原有 Spring Boot 后端开发的微信小程序，提供完整的用户点餐体验。

## 开发环境

- **微信开发者工具**：最新版 Stable
- **基础库版本**：3.3.4+
- **后端接口**：`http://localhost:8080`（需同时启动后端）

## 项目结构

```
miniapp-user/
├── app.js                  # 小程序入口（全局状态 + 登录检查）
├── app.json                # 全局配置（页面路由 + TabBar）
├── app.wxss                # 全局样式
├── project.config.json     # 微信开发者工具配置
├── images/                 # TabBar 图标（8个）
├── utils/
│   ├── request.js          # wx.request 封装（自动处理 Token/401）
│   ├── api.js              # 所有后端 API 接口定义
│   └── util.js             # 工具函数（格式化、状态文本等）
├── pages/
│   ├── index/              # 🏠 首页（搜索、Banner、分类导航、商家列表）
│   ├── shop/               # 🏪 店铺详情（菜品分类 Tab、加购、购物车弹窗）
│   ├── cart/               # 🛒 购物车（数量加减、清空、结算）
│   ├── order/              # 📝 结算页（地址选择、商品清单、提交订单）
│   ├── order-list/         # 📋 订单列表（状态筛选 Tab、取消/评价操作）
│   ├── order-detail/       # 📄 订单详情（状态、菜品清单、评价弹窗）
│   ├── tracking/           # 🚚 配送追踪（进度条、骑手信息、联系骑手）
│   ├── login/              # 🔑 登录页
│   ├── register/           # 📝 注册页
│   ├── address/            # 📍 地址管理
│   ├── address-add/        # ➕ 新增地址
│   └── user/               # 👤 个人中心
└── components/
    └── shop-card/          # 商家卡片组件
```

## 启动步骤

### 1. 启动后端
```bash
cd 项目根目录
mvn spring-boot:run
```

### 2. 打开微信开发者工具
- 点击「导入项目」
- **项目目录**：选择 `miniapp-user/` 文件夹
- **AppID**：使用测试号或你的正式 AppID
- 点击「导入」

### 3. 修改后端地址（如果需要）
编辑 `utils/request.js`，修改 `BASE_URL`：
```js
const BASE_URL = 'http://localhost:8080';  // 改为你的后端地址
```
> 微信开发者工具中需开启「不校验合法域名」选项（开发环境）

## 功能对照

| 页面 | 原始 Web 版 | 小程序版 |
|------|------------|---------|
| 首页 | index.html | pages/index |
| 店铺详情 | shop.html | pages/shop |
| 购物车 | cart.html | pages/cart |
| 结算页 | order.html | pages/order |
| 订单列表 | order-list.html | pages/order-list |
| 配送追踪 | tracking.html | pages/tracking |
| 登录 | login.html | pages/login |
| 注册 | register.html | pages/register |
| 地址管理 | 无独立页 | pages/address / address-add |
| 个人中心 | 无独立页 | pages/user |

## API 认证说明

- 登录成功后后端返回 JWT Token，存储在 `wx.getStorageSync('token')`
- 所有需登录的请求自动在 Header 添加 `token` 和 `Authorization: Bearer <token>`
- Token 过期自动跳转登录页
