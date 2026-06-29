import request from './request';

export interface RevenueTrend {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface TopDish {
  id: number;
  name: string;
  category: string;
  salesCount: number;
  revenue: number;
}

export interface ShopRank {
  name: string;
  orderCount: number;
  revenue: number;
  rating: number;
}

export interface StatisticsSummary {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalShops: number;
}

export interface OrderStatusDist {
  name: string;
  value: number;
}

export function getStatisticsSummary() {
  return request.get<unknown, StatisticsSummary>('/admin/statistics/summary');
}

export function getRevenueTrend(startDate?: string, endDate?: string) {
  return request.get<unknown, RevenueTrend[]>('/admin/statistics/revenue-trend', {
    params: { startDate, endDate },
  });
}

export function getOrderStatusDistribution() {
  return request.get<unknown, OrderStatusDist[]>('/admin/statistics/order-status-distribution');
}

export function getTopDishes(limit = 10) {
  return request.get<unknown, TopDish[]>('/admin/statistics/top-dishes', {
    params: { limit },
  });
}

export function getShopRankings(limit = 5) {
  return request.get<unknown, ShopRank[]>('/admin/statistics/shop-rankings', {
    params: { limit },
  });
}
