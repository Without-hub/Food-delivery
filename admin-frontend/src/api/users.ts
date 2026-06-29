import request from './request';
import type { User, PaginationParams, PaginatedResult } from '@/types';

export interface UserQueryParams extends PaginationParams {
  username?: string;
  phone?: string;
  role?: string;
  status?: 0 | 1;
}

export function getUsers(params: UserQueryParams) {
  return request.get<unknown, PaginatedResult<User>>('/admin/users', { params });
}

export function getUserDetail(id: number) {
  return request.get<unknown, User>(`/admin/users/${id}`);
}

export function createUser(data: Partial<User>) {
  return request.post<unknown, User>('/admin/users', data);
}

export function updateUser(id: number, data: Partial<User>) {
  return request.put<unknown, User>(`/admin/users/${id}`, data);
}

export function deleteUser(id: number) {
  return request.delete<unknown, void>(`/admin/users/${id}`);
}

export function updateUserStatus(id: number, status: 0 | 1) {
  return request.patch<unknown, void>(`/admin/users/${id}/status`, { status });
}
