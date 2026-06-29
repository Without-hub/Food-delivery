-- ============================================
-- 数据库初始化脚本
-- 数据库：food_delivery
-- ============================================

CREATE DATABASE IF NOT EXISTS `food_delivery`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `food_delivery`;

-- ============================================
-- 1. 用户表
-- ============================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username`    VARCHAR(50)  NOT NULL                COMMENT '用户名',
    `password`    VARCHAR(100) NOT NULL                COMMENT '密码',
    `phone`       VARCHAR(20)  DEFAULT NULL             COMMENT '手机号',
    `email`       VARCHAR(100) DEFAULT NULL             COMMENT '邮箱',
    `avatar`      VARCHAR(255) DEFAULT NULL             COMMENT '头像URL',
    `role`        TINYINT      DEFAULT 0               COMMENT '角色：0-普通用户 1-管理员',
    `status`      TINYINT      DEFAULT 1               COMMENT '状态：0-禁用 1-启用',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================
-- 2. 商家表
-- ============================================
DROP TABLE IF EXISTS `shop`;
CREATE TABLE `shop` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '商家ID',
    `name`          VARCHAR(100) NOT NULL                COMMENT '店铺名称',
    `logo`          VARCHAR(255) DEFAULT NULL             COMMENT '店铺Logo',
    `description`   VARCHAR(500) DEFAULT NULL             COMMENT '店铺描述',
    `category`      VARCHAR(50)  DEFAULT NULL             COMMENT '店铺分类（快餐/小吃/茶饮/炸鸡/日料/中餐）',
    `phone`         VARCHAR(20)  DEFAULT NULL             COMMENT '联系电话',
    `address`       VARCHAR(200) DEFAULT NULL             COMMENT '店铺地址',
    `rating`        DECIMAL(3,1) DEFAULT 0.0             COMMENT '评分',
    `sales_volume`  INT          DEFAULT 0               COMMENT '月销量',
    `delivery_fee`  DECIMAL(8,2) DEFAULT 0.00            COMMENT '配送费',
    `min_price`     DECIMAL(8,2) DEFAULT 0.00            COMMENT '起送价',
    `business_hours` VARCHAR(50) DEFAULT NULL             COMMENT '营业时间',
    `status`        TINYINT      DEFAULT 1               COMMENT '状态：0-休息 1-营业',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

-- ============================================
-- 3. 菜品分类表
-- ============================================
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
    `id`         BIGINT      NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name`       VARCHAR(50) NOT NULL                COMMENT '分类名称',
    `shop_id`    BIGINT      NOT NULL                COMMENT '所属商家ID',
    `sort_order` INT         DEFAULT 0               COMMENT '排序号',
    `create_time` DATETIME   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_shop_id` (`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品分类表';

-- ============================================
-- 4. 菜品表
-- ============================================
DROP TABLE IF EXISTS `dish`;
CREATE TABLE `dish` (
    `id`             BIGINT       NOT NULL AUTO_INCREMENT COMMENT '菜品ID',
    `name`           VARCHAR(100) NOT NULL                COMMENT '菜品名称',
    `image`          VARCHAR(255) DEFAULT NULL             COMMENT '菜品图片',
    `description`    VARCHAR(500) DEFAULT NULL             COMMENT '菜品描述',
    `price`          DECIMAL(8,2) NOT NULL                COMMENT '现价',
    `original_price` DECIMAL(8,2) DEFAULT NULL             COMMENT '原价（划线价）',
    `shop_id`        BIGINT       NOT NULL                COMMENT '所属商家ID',
    `category_id`    BIGINT       DEFAULT NULL             COMMENT '分类ID',
    `sales_volume`   INT          DEFAULT 0               COMMENT '月销量',
    `stock`          INT          DEFAULT 999             COMMENT '库存',
    `status`         TINYINT      DEFAULT 1               COMMENT '状态：0-下架 1-上架',
    `create_time`    DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- ============================================
-- 5. 收货地址表
-- ============================================
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '地址ID',
    `user_id`       BIGINT       NOT NULL                COMMENT '用户ID',
    `contact_name`  VARCHAR(50)  NOT NULL                COMMENT '联系人姓名',
    `contact_phone` VARCHAR(20)  NOT NULL                COMMENT '联系人电话',
    `province`      VARCHAR(50)  DEFAULT ''              COMMENT '省',
    `city`          VARCHAR(50)  DEFAULT ''              COMMENT '市',
    `district`      VARCHAR(50)  DEFAULT ''              COMMENT '区',
    `detail`        VARCHAR(200) NOT NULL                COMMENT '详细地址',
    `is_default`    TINYINT      DEFAULT 0               COMMENT '是否默认：0-否 1-是',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';

-- ============================================
-- 6. 购物车表
-- ============================================
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
    `id`          BIGINT  NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
    `user_id`     BIGINT  NOT NULL                COMMENT '用户ID',
    `dish_id`     BIGINT  NOT NULL                COMMENT '菜品ID',
    `shop_id`     BIGINT  NOT NULL                COMMENT '商家ID',
    `quantity`    INT     NOT NULL DEFAULT 1      COMMENT '数量',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    UNIQUE KEY `uk_user_dish` (`user_id`, `dish_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- ============================================
-- 7. 订单表
-- ============================================
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '订单ID',
    `order_no`      VARCHAR(32)  NOT NULL                COMMENT '订单编号',
    `user_id`       BIGINT       NOT NULL                COMMENT '用户ID',
    `shop_id`       BIGINT       NOT NULL                COMMENT '商家ID',
    `address_id`    BIGINT       DEFAULT NULL             COMMENT '收货地址ID',
    `total_price`   DECIMAL(10,2) NOT NULL               COMMENT '订单总价',
    `delivery_fee`  DECIMAL(8,2)  DEFAULT 0.00           COMMENT '配送费',
    `status`        TINYINT      DEFAULT 0               COMMENT '状态：0-待支付 1-已支付 2-配送中 3-已完成 4-已取消',
    `remark`        VARCHAR(200) DEFAULT NULL             COMMENT '备注',
    `pay_time`      DATETIME     DEFAULT NULL             COMMENT '支付时间',
    `delivery_time` DATETIME     DEFAULT NULL             COMMENT '配送时间',
    `complete_time` DATETIME     DEFAULT NULL             COMMENT '完成时间',
    `cancel_time`   DATETIME     DEFAULT NULL             COMMENT '取消时间',
    `cancel_reason` VARCHAR(200) DEFAULT NULL             COMMENT '取消原因',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- ============================================
-- 8. 订单明细表
-- ============================================
DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item` (
    `id`         BIGINT        NOT NULL AUTO_INCREMENT COMMENT '明细ID',
    `order_id`   BIGINT        NOT NULL                COMMENT '订单ID',
    `dish_id`    BIGINT        NOT NULL                COMMENT '菜品ID',
    `dish_name`  VARCHAR(100)  NOT NULL                COMMENT '菜品名称（快照）',
    `dish_image` VARCHAR(255)  DEFAULT NULL             COMMENT '菜品图片（快照）',
    `price`      DECIMAL(8,2)  NOT NULL                COMMENT '单价',
    `quantity`   INT           NOT NULL                COMMENT '数量',
    `subtotal`   DECIMAL(10,2) NOT NULL                COMMENT '小计',
    PRIMARY KEY (`id`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_dish_id` (`dish_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- ============================================
-- 9. 评价表
-- ============================================
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '评价ID',
    `user_id`     BIGINT       NOT NULL                COMMENT '用户ID',
    `order_id`    BIGINT       NOT NULL                COMMENT '订单ID',
    `dish_id`     BIGINT       NOT NULL                COMMENT '菜品ID',
    `rating`      TINYINT      NOT NULL DEFAULT 5      COMMENT '评分：1-5',
    `content`     VARCHAR(500) DEFAULT NULL             COMMENT '评价内容',
    `images`      VARCHAR(1000) DEFAULT NULL            COMMENT '评价图片（JSON数组）',
    `reply`       VARCHAR(500) DEFAULT NULL             COMMENT '商家回复',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_dish_id` (`dish_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';
