import request from './request';
import type { Dish, PaginationParams, PaginatedResult } from '@/types';

export interface DishQueryParams extends PaginationParams {
  name?: string;
  categoryId?: number;
  shopId?: number;
  status?: 0 | 1;
}

export function getDishes(params: DishQueryParams) {
  return request.get<unknown, PaginatedResult<Dish>>('/dishes', { params });
}

export function getDishDetail(id: number) {
  return request.get<unknown, Dish>(`/dishes/${id}`);
}

export function createDish(data: Partial<Dish>) {
  return request.post<unknown, Dish>('/dishes', data);
}

export function updateDish(id: number, data: Partial<Dish>) {
  return request.put<unknown, Dish>(`/dishes/${id}`, data);
}

export function deleteDish(id: number) {
  return request.delete<unknown, void>(`/dishes/${id}`);
}
