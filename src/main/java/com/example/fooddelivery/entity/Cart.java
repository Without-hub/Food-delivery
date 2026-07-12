package com.example.fooddelivery.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Cart {
    private Long id;
    private Long userId;
    private Long dishId;
    private Long shopId;
    private Integer quantity;
    private LocalDateTime createTime;
}
