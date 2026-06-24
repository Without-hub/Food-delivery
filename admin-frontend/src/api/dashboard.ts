import request from './request';
import type { DashboardStats } from '@/types';

export function getDashboardStats() {
  return request.get<unknown, DashboardStats>('/dashboard/stats');
}

export function getDailyRevenue(days = 7) {
  return request.get<unknown, { date: string; revenue: number }[]>('/dashboard/daily-revenue', {
    params: { days },
  });
}

export function getTopDishes(limit = 10) {
  return request.get<unknown, { id: number; name: string; salesCount: number }[]>('/dashboard/top-dishes', {
    params: { limit },
  });
}
