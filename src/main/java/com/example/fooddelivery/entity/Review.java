package com.example.fooddelivery.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Review {
    private Long id;
    private Long userId;
    private Long orderId;
    private Long dishId;
    private Integer rating;     // 评分：1-5
    private String content;
    private String images;      // 评价图片（JSON数组）
    private String reply;
    private LocalDateTime createTime;
}
