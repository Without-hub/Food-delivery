-- ============================================
-- 测试数据（先执行 schema.sql 建表后再执行本文件）
-- ============================================

-- 1. 测试用户（密码123456）
INSERT INTO food_delivery.`user` (username, password, phone, email, role, status) VALUES
('testuser', '123456', '13800000001', 'test@qq.com', 0, 1),
('admin',    '123456', '13800000002', 'admin@qq.com', 1, 1);

-- 2. 测试商家
INSERT INTO food_delivery.`shop` (name, logo, description, category, phone, address, rating, sales_volume, delivery_fee, min_price, business_hours, status) VALUES
('老王快餐', NULL, '十年老店，好吃不贵', '快餐', '010-12345678', '学府路18号', 4.5, 1200, 3.00, 15.00, '09:00-21:00', 1),
('张姐小吃', NULL, '地道川味小吃',       '小吃', '010-87654321', '学院路25号', 4.2,  800, 2.00, 12.00, '08:00-22:00', 1);

-- 3. 菜品分类
INSERT INTO food_delivery.`category` (name, shop_id, sort_order) VALUES
('热销推荐', 1, 1),
('主食',     1, 2),
('饮品',     1, 3),
('小吃',     2, 1),
('饮品',     2, 2);

-- 4. 菜品（老王快餐 6 个 + 张姐小吃 3 个）
INSERT INTO food_delivery.`dish` (name, image, description, price, original_price, shop_id, category_id, sales_volume, stock, status) VALUES
('宫保鸡丁盖饭', NULL, '经典川味，鸡肉嫩滑',   18.00, 22.00, 1, 1, 500, 999, 1),
('鱼香肉丝盖饭', NULL, '酸甜可口，下饭神器',   16.00, 20.00, 1, 1, 450, 999, 1),
('红烧牛肉面',   NULL, '大块牛肉，汤浓面筋道', 22.00, NULL,  1, 2, 380, 999, 1),
('蛋炒饭',       NULL, '粒粒分明，家常味道',   12.00, NULL,  1, 2, 620, 999, 1),
('冰可乐',       NULL, '冰镇可口可乐330ml',     5.00, NULL,  1, 3, 900, 999, 1),
('冰柠檬水',     NULL, '鲜榨柠檬，清爽解腻',    6.00, NULL,  1, 3, 700, 999, 1),
('酸辣粉',       NULL, '正宗重庆酸辣粉',       10.00, NULL,  2, 4, 350, 999, 1),
('红糖糍粑',     NULL, '软糯香甜，现做现卖',    8.00, 10.00, 2, 4, 280, 999, 1),
('珍珠奶茶',     NULL, '大颗珍珠，浓郁奶茶',   12.00, NULL,  2, 5, 550, 999, 1);

-- 5. 收货地址
INSERT INTO food_delivery.`address` (user_id, contact_name, contact_phone, province, city, district, detail, is_default) VALUES
(1, '小魏', '13800000001', 'XX省', 'XX市', 'XX区', '学府路18号 3栋501', 1),
(1, '小魏', '13800000001', 'XX省', 'XX市', 'XX区', '学院路25号 7栋202', 0);

-- 6. 购物车（下单测试用）
INSERT INTO food_delivery.`cart` (user_id, dish_id, shop_id, quantity) VALUES
(1, 1, 1, 2),
(1, 3, 1, 1),
(1, 5, 1, 1);
