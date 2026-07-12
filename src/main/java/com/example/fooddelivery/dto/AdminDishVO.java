package com.example.fooddelivery.dto;

import lombok.Data;

@Data
public class AdminDishVO {
    private Long id;
    private String name;
    private String image;
    private String description;
    private java.math.BigDecimal price;
    private java.math.BigDecimal originalPrice;
    private Long shopId;
    private String shopName;
    private Long categoryId;
    private String categoryName;
    private Integer salesVolume;
    private Integer stock;
    private Integer status;
    private java.time.LocalDateTime createTime;
}
