import request from './request';
import type { Shop, PaginationParams, PaginatedResult } from '@/types';

export interface ShopQueryParams extends PaginationParams {
  name?: string;
  status?: 0 | 1 | 2;
}

export function getShops(params: ShopQueryParams) {
  return request.get<unknown, PaginatedResult<Shop>>('/shops', { params });
}

export function getShopDetail(id: number) {
  return request.get<unknown, Shop>(`/shops/${id}`);
}

export function createShop(data: Partial<Shop>) {
  return request.post<unknown, Shop>('/shops', data);
}

export function updateShop(id: number, data: Partial<Shop>) {
  return request.put<unknown, Shop>(`/shops/${id}`, data);
}

export function deleteShop(id: number) {
  return request.delete<unknown, void>(`/shops/${id}`);
}

export function updateShopStatus(id: number, status: 0 | 1 | 2) {
  return request.patch<unknown, void>(`/shops/${id}/status`, { status });
}
