package com.example.fooddelivery.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Dish {
    private Long id;
    private String name;
    private String image;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Long shopId;
    private Long categoryId;
    private Integer salesVolume;
    private Integer stock;
    private Integer status;     // 0-下架, 1-上架
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
