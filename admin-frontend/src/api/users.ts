import request from './request';
import type { User, PaginationParams, PaginatedResult } from '@/types';

export interface UserQueryParams extends PaginationParams {
  username?: string;
  phone?: string;
  role?: string;
  status?: 0 | 1;
}

export function getUsers(params: UserQueryParams) {
  return request.get<unknown, PaginatedResult<User>>('/users', { params });
}

export function getUserDetail(id: number) {
  return request.get<unknown, User>(`/users/${id}`);
}

export function createUser(data: Partial<User>) {
  return request.post<unknown, User>('/users', data);
}

export function updateUser(id: number, data: Partial<User>) {
  return request.put<unknown, User>(`/users/${id}`, data);
}

export function deleteUser(id: number) {
  return request.delete<unknown, void>(`/users/${id}`);
}

export function updateUserStatus(id: number, status: 0 | 1) {
  return request.patch<unknown, void>(`/users/${id}/status`, { status });
}
