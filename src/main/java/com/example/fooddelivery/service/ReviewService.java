package com.example.fooddelivery.service;

import com.example.fooddelivery.entity.Review;
import java.util.List;

public interface ReviewService {
    void addReview(Long userId, Long dishId, Long orderId, String content, Integer rating);
    void deleteReview(Long reviewId, Long userId);
    List<Review> getReviewByDishId(Long dishId);
    List<Review> getReviewByUserId(Long userId);
    Double getAvgRatingByDishId(Long dishId);
}
