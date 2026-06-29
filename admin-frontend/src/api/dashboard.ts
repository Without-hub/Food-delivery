import request from './request';
import type { DashboardStats } from '@/types';

export function getDashboardStats() {
  return request.get<unknown, DashboardStats>('/admin/dashboard/stats');
}

export function getDailyRevenue(days = 7) {
  return request.get<unknown, { date: string; revenue: number }[]>('/admin/dashboard/daily-revenue', {
    params: { days },
  });
}

export function getTopDishes(limit = 10) {
  return request.get<unknown, { id: number; name: string; salesCount: number }[]>('/admin/dashboard/top-dishes', {
    params: { limit },
  });
}
