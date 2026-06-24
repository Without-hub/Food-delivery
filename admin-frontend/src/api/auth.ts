import request from './request';
import type { User } from '@/types';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: User;
}

export function login(data: LoginParams) {
  return request.post<unknown, LoginResult>('/auth/login', data);
}

export function logout() {
  return request.post<unknown, void>('/auth/logout');
}

export function getCurrentUser() {
  return request.get<unknown, User>('/auth/current-user');
}
