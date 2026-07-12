package com.example.fooddelivery.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Shop {
    private Long id;
    private String name;
    private String logo;
    private String description;
    private String category;
    private String phone;
    private String address;
    private BigDecimal rating;
    private Integer salesVolume;
    private BigDecimal deliveryFee;
    private BigDecimal minPrice;
    private String businessHours;
    private Integer status;     // 0-休息, 1-营业
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
