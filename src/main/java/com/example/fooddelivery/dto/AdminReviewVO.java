package com.example.fooddelivery.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminReviewVO {
    private Long id;
    private Long userId;
    private String userName;
    private Long orderId;
    private String orderNo;
    private Long dishId;
    private String dishName;
    private Integer rating;
    private String content;
    private String reply;
    private LocalDateTime createTime;
}
