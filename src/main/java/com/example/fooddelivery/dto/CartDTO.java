package com.example.fooddelivery.dto;

import lombok.Data;

@Data
public class CartDTO {
    private Long id;
    private Long userId;
    private Long dishId;
    private Long shopId;
    private Integer quantity;
    private String dishName;
    private String dishImage;
    private java.math.BigDecimal price;
}
