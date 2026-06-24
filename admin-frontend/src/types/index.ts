// 用户相关
export interface User {
  id: number;
  username: string;
  password?: string;
  phone: string;
  email: string;
  avatar: string;
  role: 'admin' | 'merchant' | 'rider' | 'customer';
  status: 0 | 1;
  createTime: string;
  updateTime: string;
}

// 商家相关
export interface Shop {
  id: number;
  name: string;
  description: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  status: 0 | 1 | 2; // 0-关闭 1-营业中 2-休息中
  rating: number;
  salesCount: number;
  deliveryFee: number;
  minOrderAmount: number;
  openingTime: string;
  closingTime: string;
  categoryId: number;
  createTime: string;
  updateTime: string;
}

// 分类相关
export interface Category {
  id: number;
  name: string;
  sort: number;
  status: 0 | 1;
  createTime: string;
  updateTime: string;
}

// 菜品相关
export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  categoryName?: string;
  shopId: number;
  shopName?: string;
  status: 0 | 1; // 0-停售 1-在售
  salesCount: number;
  rating: number;
  createTime: string;
  updateTime: string;
}

// 订单相关
export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  userName?: string;
  shopId: number;
  shopName?: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: 'alipay' | 'wechat' | 'cash';
  status: OrderStatus;
  addressId: number;
  deliveryAddress?: string;
  riderId?: number;
  riderName?: string;
  remark: string;
  orderItems?: OrderItem[];
  createTime: string;
  updateTime: string;
  payTime?: string;
  deliveryTime?: string;
  completeTime?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  dishId: number;
  dishName: string;
  dishImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5;
// 0-待支付 1-已支付/待接单 2-已接单/备餐中 3-配送中 4-已完成 5-已取消

export const OrderStatusMap: Record<OrderStatus, string> = {
  0: '待支付',
  1: '待接单',
  2: '备餐中',
  3: '配送中',
  4: '已完成',
  5: '已取消',
};

export const OrderStatusColorMap: Record<OrderStatus, string> = {
  0: 'orange',
  1: 'blue',
  2: 'processing',
  3: 'purple',
  4: 'success',
  5: 'default',
};

// 配送相关
export interface Delivery {
  id: number;
  orderId: number;
  orderNo?: string;
  riderId?: number;
  riderName?: string;
  riderPhone?: string;
  status: DeliveryStatus;
  pickupTime?: string;
  deliveryTime?: string;
  estimatedTime?: string;
  pickupAddress: string;
  deliveryAddress: string;
  createTime: string;
  updateTime: string;
}

export type DeliveryStatus = 0 | 1 | 2 | 3;
export const DeliveryStatusMap: Record<DeliveryStatus, string> = {
  0: '待分配',
  1: '待取餐',
  2: '配送中',
  3: '已送达',
};

// 评价相关
export interface Review {
  id: number;
  userId: number;
  userName?: string;
  userAvatar?: string;
  orderId: number;
  shopId: number;
  shopName?: string;
  dishId: number;
  dishName?: string;
  rating: number;
  content: string;
  images: string[];
  replyContent?: string;
  replyTime?: string;
  status: 0 | 1; // 0-隐藏 1-显示
  createTime: string;
  updateTime: string;
}

// 统计相关
export interface DashboardStats {
  todayOrderCount: number;
  todayRevenue: number;
  todayNewUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalShops: number;
  totalDishes: number;
  orderStatusDistribution: { status: OrderStatus; count: number }[];
  dailyRevenue: { date: string; revenue: number }[];
  topDishes: { id: number; name: string; salesCount: number }[];
}

// API通用响应
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页结果
export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
