package com.example.fooddelivery.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminOrderVO {
    private Long id;
    private String orderNo;
    private Long userId;
    private String userName;
    private Long shopId;
    private String shopName;
    private BigDecimal totalAmount;
    private BigDecimal deliveryFee;
    private Integer status;
    private String remark;
    private LocalDateTime payTime;
    private LocalDateTime deliveryTime;
    private LocalDateTime completeTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
