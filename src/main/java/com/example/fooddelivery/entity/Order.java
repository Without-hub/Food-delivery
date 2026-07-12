package com.example.fooddelivery.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Order {
    private Long id;
    private String orderNo;
    private Long userId;
    private Long shopId;
    private Long addressId;
    private BigDecimal totalPrice;
    private BigDecimal deliveryFee;
    private Integer status;     // 0-待支付, 1-已支付/待接单, 2-配送中, 3-已完成, 4-已取消
    private String remark;
    private LocalDateTime payTime;
    private LocalDateTime deliveryTime;
    private LocalDateTime completeTime;
    private LocalDateTime cancelTime;
    private String cancelReason;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
