import request from './request';
import type { Delivery, PaginationParams, PaginatedResult } from '@/types';

export interface DeliveryQueryParams extends PaginationParams {
  status?: number;
  riderId?: number;
}

export function getDeliveries(params: DeliveryQueryParams) {
  return request.get<unknown, PaginatedResult<Delivery>>('/deliveries', { params });
}

export function assignRider(id: number, riderId: number) {
  return request.put<unknown, void>(`/deliveries/${id}/assign`, { riderId });
}

export function updateDeliveryStatus(id: number, status: number) {
  return request.put<unknown, void>(`/deliveries/${id}/status`, { status });
}

export function getAvailableRiders() {
  return request.get<unknown, { id: number; name: string; phone: string }[]>('/deliveries/available-riders');
}
