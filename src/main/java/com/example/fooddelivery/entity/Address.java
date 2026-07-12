package com.example.fooddelivery.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Address {
    private Long id;
    private Long userId;
    private String contactName;
    private String contactPhone;
    private String province;
    private String city;
    private String district;
    private String detail;
    private Integer isDefault;  // 0-否, 1-是
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
