package com.example.fooddelivery.controller;

import com.example.fooddelivery.entity.Review;
import com.example.fooddelivery.service.ReviewService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {
    @Resource
    private ReviewService reviewService;

    @PostMapping("/add")
    public String add(@RequestParam Long userId,
                      @RequestParam Long dishId,
                      @RequestParam Long orderId,
                      @RequestParam String content,
                      @RequestParam Integer rating){
        reviewService.addReview(userId, dishId, orderId, content, rating);
        return "success";
    }

    @DeleteMapping("/delete")
    public String delete(@RequestParam Long reviewId, @RequestParam Long userId){
        reviewService.deleteReview(reviewId, userId);
        return "success";
    }

    @GetMapping("/dish")
    public List<Review> dishReview(@RequestParam Long dishId){
        return reviewService.getReviewByDishId(dishId);
    }

    @GetMapping("/my")
    public List<Review> myReview(@RequestParam Long userId){
        return reviewService.getReviewByUserId(userId);
    }
}