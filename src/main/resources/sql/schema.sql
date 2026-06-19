-- ============================================
-- 外卖点餐系统 — 数据库建表脚本
-- MySQL 8.0+
-- ============================================

CREATE DATABASE IF NOT EXISTS food_delivery
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE food_delivery;

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE `user` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username`    VARCHAR(32)  NOT NULL COMMENT '用户名',
    `password`    VARCHAR(128) NOT NULL COMMENT '密码（加密存储）',
    `phone`       VARCHAR(16)  DEFAULT NULL COMMENT '手机号',
    `email`       VARCHAR(64)  DEFAULT NULL COMMENT '邮箱',
    `avatar`      VARCHAR(256) DEFAULT NULL COMMENT '头像URL',
    `role`        TINYINT      NOT NULL DEFAULT 0 COMMENT '角色：0-普通用户, 1-管理员',
    `status`      TINYINT      NOT NULL DEFAULT 1 COMMENT '状态：0-禁用, 1-启用',
    `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ============================================
-- 2. 商家/店铺表
-- ============================================
CREATE TABLE `shop` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '商家ID',
    `name`        VARCHAR(64)  NOT NULL COMMENT '商家名称',
    `logo`        VARCHAR(256) DEFAULT NULL COMMENT '商家Logo URL',
    `description` VARCHAR(512) DEFAULT NULL COMMENT '商家简介',
    `category`    VARCHAR(32)  DEFAULT NULL COMMENT '商家分类（快餐、火锅、烧烤等）',
    `phone`       VARCHAR(16)  DEFAULT NULL COMMENT '联系电话',
    `address`     VARCHAR(256) DEFAULT NULL COMMENT '商家地址',
    `rating`      DECIMAL(2,1) DEFAULT 0.0 COMMENT '平均评分',
    `sales_volume` INT         DEFAULT 0 COMMENT '月销量',
    `delivery_fee` DECIMAL(6,2) DEFAULT 0.00 COMMENT '配送费',
    `min_price`   DECIMAL(6,2) DEFAULT 0.00 COMMENT '起送价',
    `business_hours` VARCHAR(64) DEFAULT NULL COMMENT '营业时间',
    `status`      TINYINT      NOT NULL DEFAULT 1 COMMENT '状态：0-休息, 1-营业',
    `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_rating` (`rating`),
    KEY `idx_sales_volume` (`sales_volume`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

-- ============================================
-- 3. 菜品分类表
-- ============================================
CREATE TABLE `category` (
    `id`          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name`        VARCHAR(32) NOT NULL COMMENT '分类名称（热销、主食、小吃、饮品等）',
    `shop_id`     BIGINT      NOT NULL COMMENT '所属商家ID',
    `sort_order`  INT         DEFAULT 0 COMMENT '排序号',
    `create_time` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_shop_id` (`shop_id`),
    CONSTRAINT `fk_category_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品分类表';

-- ============================================
-- 4. 菜品表
-- ============================================
CREATE TABLE `dish` (
    `id`          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '菜品ID',
    `name`        VARCHAR(64)   NOT NULL COMMENT '菜品名称',
    `image`       VARCHAR(256)  DEFAULT NULL COMMENT '菜品图片URL',
    `description` VARCHAR(256)  DEFAULT NULL COMMENT '菜品描述',
    `price`       DECIMAL(8,2)  NOT NULL COMMENT '价格',
    `original_price` DECIMAL(8,2) DEFAULT NULL COMMENT '原价（用于展示划线价）',
    `shop_id`     BIGINT        NOT NULL COMMENT '所属商家ID',
    `category_id` BIGINT        NOT NULL COMMENT '所属分类ID',
    `sales_volume` INT          DEFAULT 0 COMMENT '销量',
    `stock`       INT           DEFAULT 9999 COMMENT '库存',
    `status`      TINYINT       NOT NULL DEFAULT 1 COMMENT '状态：0-下架, 1-上架',
    `create_time` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_name` (`name`),
    CONSTRAINT `fk_dish_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_dish_category` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- ============================================
-- 5. 收货地址表
-- ============================================
CREATE TABLE `address` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '地址ID',
    `user_id`       BIGINT       NOT NULL COMMENT '用户ID',
    `contact_name`  VARCHAR(32)  NOT NULL COMMENT '联系人姓名',
    `contact_phone` VARCHAR(16)  NOT NULL COMMENT '联系人电话',
    `province`      VARCHAR(32)  DEFAULT NULL COMMENT '省',
    `city`          VARCHAR(32)  DEFAULT NULL COMMENT '市',
    `district`      VARCHAR(32)  DEFAULT NULL COMMENT '区',
    `detail`        VARCHAR(256) NOT NULL COMMENT '详细地址',
    `is_default`    TINYINT      NOT NULL DEFAULT 0 COMMENT '是否默认地址：0-否, 1-是',
    `create_time`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';

-- ============================================
-- 6. 购物车表
-- ============================================
CREATE TABLE `cart` (
    `id`          BIGINT   NOT NULL AUTO_INCREMENT COMMENT '购物车项ID',
    `user_id`     BIGINT   NOT NULL COMMENT '用户ID',
    `dish_id`     BIGINT   NOT NULL COMMENT '菜品ID',
    `shop_id`     BIGINT   NOT NULL COMMENT '商家ID（冗余，用于按商家分组展示）',
    `quantity`    INT      NOT NULL DEFAULT 1 COMMENT '数量',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_dish` (`user_id`, `dish_id`),
    KEY `idx_user_id` (`user_id`),
    CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cart_dish` FOREIGN KEY (`dish_id`) REFERENCES `dish`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- ============================================
-- 7. 订单表
-- ============================================
CREATE TABLE `order` (
    `id`              BIGINT        NOT NULL AUTO_INCREMENT COMMENT '订单ID',
    `order_no`        VARCHAR(32)   NOT NULL COMMENT '订单编号（展示用）',
    `user_id`         BIGINT        NOT NULL COMMENT '用户ID',
    `shop_id`         BIGINT        NOT NULL COMMENT '商家ID',
    `address_id`      BIGINT        NOT NULL COMMENT '收货地址ID',
    `total_price`     DECIMAL(10,2) NOT NULL COMMENT '订单总价（菜品+配送费）',
    `delivery_fee`    DECIMAL(6,2)  NOT NULL DEFAULT 0.00 COMMENT '配送费',
    `status`          TINYINT       NOT NULL DEFAULT 0 COMMENT '订单状态：0-待支付, 1-已支付/待接单, 2-配送中, 3-已完成, 4-已取消',
    `remark`          VARCHAR(256)  DEFAULT NULL COMMENT '备注',
    `pay_time`        DATETIME      DEFAULT NULL COMMENT '支付时间',
    `delivery_time`   DATETIME      DEFAULT NULL COMMENT '配送时间',
    `complete_time`   DATETIME      DEFAULT NULL COMMENT '完成时间',
    `cancel_time`     DATETIME      DEFAULT NULL COMMENT '取消时间',
    `cancel_reason`   VARCHAR(256)  DEFAULT NULL COMMENT '取消原因',
    `create_time`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_shop_id` (`shop_id`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`),
    CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    CONSTRAINT `fk_order_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop`(`id`),
    CONSTRAINT `fk_order_address` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- ============================================
-- 8. 订单明细表
-- ============================================
CREATE TABLE `order_item` (
    `id`          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '明细ID',
    `order_id`    BIGINT        NOT NULL COMMENT '订单ID',
    `dish_id`     BIGINT        NOT NULL COMMENT '菜品ID',
    `dish_name`   VARCHAR(64)   NOT NULL COMMENT '菜品名称（快照）',
    `dish_image`  VARCHAR(256)  DEFAULT NULL COMMENT '菜品图片（快照）',
    `price`       DECIMAL(8,2)  NOT NULL COMMENT '下单时单价',
    `quantity`    INT           NOT NULL COMMENT '数量',
    `subtotal`    DECIMAL(10,2) NOT NULL COMMENT '小计',
    PRIMARY KEY (`id`),
    KEY `idx_order_id` (`order_id`),
    CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_item_dish` FOREIGN KEY (`dish_id`) REFERENCES `dish`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- ============================================
-- 9. 评价表
-- ============================================
CREATE TABLE `review` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '评价ID',
    `user_id`     BIGINT       NOT NULL COMMENT '用户ID',
    `order_id`    BIGINT       NOT NULL COMMENT '订单ID',
    `dish_id`     BIGINT       DEFAULT NULL COMMENT '菜品ID（可选，针对菜品评价）',
    `rating`      TINYINT      NOT NULL COMMENT '评分：1-5',
    `content`     VARCHAR(512) DEFAULT NULL COMMENT '评价内容',
    `images`      VARCHAR(1024) DEFAULT NULL COMMENT '评价图片URL（多张逗号分隔）',
    `reply`       VARCHAR(512) DEFAULT NULL COMMENT '商家回复',
    `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_order` (`user_id`, `order_id`),
    KEY `idx_order_id` (`order_id`),
    KEY `idx_dish_id` (`dish_id`),
    CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    CONSTRAINT `fk_review_order` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_review_dish` FOREIGN KEY (`dish_id`) REFERENCES `dish`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';
