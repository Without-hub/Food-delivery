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
  return request.get<unknown, PaginatedResult<Order>>('/orders', { params });
}

export function getOrderDetail(id: number) {
  return request.get<unknown, Order>(`/orders/${id}`);
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return request.put<unknown, void>(`/orders/${id}/status`, null, {
    params: { status },
  });
}

export function cancelOrder(id: number) {
  return request.put<unknown, void>(`/orders/${id}/cancel`);
}

export function deleteOrder(id: number) {
  return request.delete<unknown, void>(`/orders/${id}`);
}
