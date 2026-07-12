package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.entity.Review;
import com.example.fooddelivery.mapper.ReviewMapper;
import com.example.fooddelivery.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;

    public ReviewServiceImpl(ReviewMapper reviewMapper) {
        this.reviewMapper = reviewMapper;
    }

    @Override
    @Transactional
    public void addReview(Long userId, Long dishId, Long orderId, String content, Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("评分必须在1-5之间");
        }
        Review exist = reviewMapper.selectByUserAndOrder(userId, orderId);
        if (exist != null) {
            throw new RuntimeException("该订单已评价过");
        }
        Review review = new Review();
        review.setUserId(userId);
        review.setDishId(dishId);
        review.setOrderId(orderId);
        review.setContent(content);
        review.setRating(rating);
        reviewMapper.insert(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewMapper.selectById(reviewId);
        if (review == null || !review.getUserId().equals(userId)) {
            throw new RuntimeException("无权删除该评价");
        }
        reviewMapper.deleteById(reviewId);
    }

    @Override
    public List<Review> getReviewByDishId(Long dishId) {
        return reviewMapper.selectByDishId(dishId);
    }

    @Override
    public List<Review> getReviewByUserId(Long userId) {
        return reviewMapper.selectByUserId(userId);
    }

    @Override
    public Double getAvgRatingByDishId(Long dishId) {
        return reviewMapper.selectAvgRatingByDishId(dishId);
    }
}
