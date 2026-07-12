package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.PageResult;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.mapper.OrderMapper;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/deliveries")
public class DeliveryController {

    private final OrderMapper orderMapper;

    public DeliveryController(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @GetMapping
    public Result<PageResult<Map<String, Object>>> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (page - 1) * pageSize;
        // 查询配送相关订单（已支付/配送中/已完成）
        List<com.example.fooddelivery.dto.AdminOrderVO> allOrders =
                orderMapper.selectAdminOrders(null, null, 0, 10000);
        List<Map<String, Object>> deliveryOrders = allOrders.stream()
                .filter(o -> o.getStatus() >= 1 && o.getStatus() <= 3)
                .filter(o -> status == null || o.getStatus().equals(status))
                .sorted((a, b) -> b.getCreateTime().compareTo(a.getCreateTime()))
                .map(o -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", o.getId());
                    m.put("orderId", o.getId());
                    m.put("orderNo", o.getOrderNo());
                    m.put("shopName", o.getShopName());
                    m.put("userName", o.getUserName());
                    m.put("riderId", null);
                    m.put("riderName", null);
                    m.put("riderPhone", null);
                    m.put("status", o.getStatus());
                    m.put("pickupAddress", "商家地址");
                    m.put("deliveryAddress", "用户地址");
                    m.put("createTime", o.getCreateTime());
                    m.put("updateTime", o.getUpdateTime());
                    return m;
                }).toList();

        int total = deliveryOrders.size();
        List<Map<String, Object>> pageList = deliveryOrders.stream()
                .skip(offset).limit(pageSize).toList();

        return Result.ok(new PageResult<>(pageList, total, page, pageSize));
    }

    @PutMapping("/{id}/assign")
    public Result<Void> assignRider(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        // Delivery assignment is a placeholder - no rider table exists
        return Result.ok();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateDeliveryStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Integer status = body.get("status") instanceof Integer ? (Integer) body.get("status") : null;
        if (status != null) {
            orderMapper.updateStatus(id, status);
        }
        return Result.ok();
    }

    @GetMapping("/available-riders")
    public Result<List<Map<String, Object>>> availableRiders() {
        List<Map<String, Object>> riders = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("id", 300L + i);
            r.put("name", "骑手" + i);
            r.put("phone", "1380000" + (300 + i));
            riders.add(r);
        }
        return Result.ok(riders);
    }
}
