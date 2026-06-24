package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Review;
import com.example.fooddelivery.service.ReviewService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/review")
public class ReviewController {
    @Resource
    private ReviewService reviewService;

    @PostMapping("/add")
    public Result<String> add(@RequestParam Long userId,
                              @RequestParam Long dishId,
                              @RequestParam Long orderId,
                              @RequestParam String content,
                              @RequestParam Integer rating) {
        reviewService.addReview(userId, dishId, orderId, content, rating);
        return Result.ok("评价成功");
    }

    @DeleteMapping("/delete")
    public Result<String> delete(@RequestParam Long reviewId, @RequestParam Long userId) {
        reviewService.deleteReview(reviewId, userId);
        return Result.ok("删除成功");
    }

    @GetMapping("/dish")
    public Result<List<Review>> dishReview(@RequestParam Long dishId) {
        return Result.ok(reviewService.getReviewByDishId(dishId));
    }

    @GetMapping("/my")
    public Result<List<Review>> myReview(@RequestParam Long userId) {
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
