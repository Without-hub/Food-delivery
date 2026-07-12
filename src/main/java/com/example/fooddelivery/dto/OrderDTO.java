package com.example.fooddelivery.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderDTO {
    // 请求用
    private Long addressId;
    private String remark;

    // 响应用
    private Long id;
    private String orderNo;
    private Long userId;
    private Long shopId;
    private String shopName;
    private String addressDetail;
    private String contactName;
    private String contactPhone;
    private BigDecimal totalPrice;
    private BigDecimal deliveryFee;
    private Integer status;
    private String statusText;
    private LocalDateTime createTime;
    private LocalDateTime payTime;
    private LocalDateTime deliveryTime;
    private LocalDateTime completeTime;
    private List<OrderItemDTO> items;
    private Boolean hasReview;

    public static String statusText(Integer status) {
        return switch (status) {
            case 0 -> "待支付";
            case 1 -> "已支付/待接单";
            case 2 -> "配送中";
            case 3 -> "已完成";
            case 4 -> "已取消";
            default -> "未知";
        };
    }
}
