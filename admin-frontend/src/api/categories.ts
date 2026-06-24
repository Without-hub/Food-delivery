import request from './request';
import type { Category } from '@/types';

export function getCategories() {
  return request.get<unknown, Category[]>('/categories');
}

export function createCategory(data: Partial<Category>) {
  return request.post<unknown, Category>('/categories', data);
}

export function updateCategory(id: number, data: Partial<Category>) {
  return request.put<unknown, Category>(`/categories/${id}`, data);
}

export function deleteCategory(id: number) {
  return request.delete<unknown, void>(`/categories/${id}`);
}
