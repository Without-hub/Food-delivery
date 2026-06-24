import request from './request';
import type { Review, PaginationParams, PaginatedResult } from '@/types';

export interface ReviewQueryParams extends PaginationParams {
  shopId?: number;
  status?: 0 | 1;
  rating?: number;
}

export function getReviews(params: ReviewQueryParams) {
  return request.get<unknown, PaginatedResult<Review>>('/reviews', { params });
}

export function replyReview(id: number, content: string) {
  return request.put<unknown, void>(`/reviews/${id}/reply`, { content });
}

export function updateReviewStatus(id: number, status: 0 | 1) {
  return request.patch<unknown, void>(`/reviews/${id}/status`, { status });
}

export function deleteReview(id: number) {
  return request.delete<unknown, void>(`/reviews/${id}`);
}
