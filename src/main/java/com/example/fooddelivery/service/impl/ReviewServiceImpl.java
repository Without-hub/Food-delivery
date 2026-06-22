package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.entity.Review;
import com.example.fooddelivery.mapper.ReviewMapper;
import com.example.fooddelivery.service.ReviewService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Resource
    private ReviewMapper reviewMapper;

    @Override
    public void addReview(Long userId, Long dishId, Long orderId, String content, Integer rating) {
        Review review = new Review();
        review.setUserId(userId);
        review.setDishId(dishId);
        review.setOrderId(orderId);
        review.setContent(content);
        review.setRating(rating);
        review.setCreateTime(LocalDateTime.now());
        reviewMapper.insert(review);
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewMapper.selectById(reviewId);
        if(review == null || !review.getUserId().equals(userId)){
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
}