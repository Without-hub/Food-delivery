package com.example.fooddelivery.controller;

import com.example.fooddelivery.config.SecurityUtil;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Review;
import com.example.fooddelivery.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public Result<String> add(@RequestParam Long dishId,
                              @RequestParam Long orderId,
                              @RequestParam String content,
                              @RequestParam Integer rating) {
        Long userId = SecurityUtil.getCurrentUserId();
        reviewService.addReview(userId, dishId, orderId, content, rating);
        return Result.ok("评价成功");
    }

    @DeleteMapping("/delete")
    public Result<String> delete(@RequestParam Long reviewId) {
        Long userId = SecurityUtil.getCurrentUserId();
        reviewService.deleteReview(reviewId, userId);
        return Result.ok("删除成功");
    }

    @GetMapping("/dish")
    public Result<List<Review>> dishReview(@RequestParam Long dishId) {
        return Result.ok(reviewService.getReviewByDishId(dishId));
    }

    @GetMapping("/my")
    public Result<List<Review>> myReview() {
        Long userId = SecurityUtil.getCurrentUserId();
        return Result.ok(reviewService.getReviewByUserId(userId));
    }

    @GetMapping("/rating")
    public Result<Map<String, Object>> rating(@RequestParam Long dishId) {
        Double avg = reviewService.getAvgRatingByDishId(dishId);
        Map<String, Object> map = new HashMap<>();
        map.put("dishId", dishId);
        map.put("avgRating", avg);
        return Result.ok(map);
    }
}
