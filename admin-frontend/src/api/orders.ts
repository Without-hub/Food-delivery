import request from './request';
import type { Order, OrderStatus, PaginationParams, PaginatedResult } from '@/types';

export interface OrderQueryParams extends PaginationParams {
  status?: OrderStatus;
  orderNo?: string;
  shopId?: number;
  startTime?: string;
  endTime?: string;
}

export function getOrders(params: OrderQueryParams) {
  return request.get<unknown, PaginatedResult<Order>>('/admin/orders', { params });
}

export function getOrderDetail(id: number) {
  return request.get<unknown, Order>(`/admin/orders/${id}`);
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return request.put<unknown, void>(`/admin/orders/${id}/status`, null, {
    params: { status },
  });
}

export function cancelOrder(id: number) {
  return request.put<unknown, void>(`/admin/orders/${id}/cancel`);
}

export function deleteOrder(id: number) {
  return request.delete<unknown, void>(`/admin/orders/${id}`);
}
