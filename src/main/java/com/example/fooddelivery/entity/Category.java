package com.example.fooddelivery.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Category {
    private Long id;
    private String name;
    private Long shopId;
    private Integer sortOrder;
    private LocalDateTime createTime;
}
