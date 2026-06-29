package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.PageResult;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Order;
import com.example.fooddelivery.entity.Shop;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.OrderMapper;
import com.example.fooddelivery.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/deliveries")
public class DeliveryController {

    @Resource
    private OrderMapper orderMapper;
    @Resource
    private UserMapper userMapper;

    @GetMapping
    public Result<PageResult<Map<String, Object>>> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        // Use orders in delivery-related status (status 2 = 配送中)
        int offset = (page - 1) * pageSize;
        List<Order> orders = orderMapper.selectByUserId(1L, null);
        if (status != null) {
            orders = orders.stream().filter(o -> o.getStatus() == status).collect(Collectors.toList());
        }
        // Filter for delivery-relevant statuses: 1(paid/待配送), 2(配送中), 3(已完成)
        orders = orders.stream().filter(o -> o.getStatus() >= 1 && o.getStatus() <= 3)
                .sorted((a, b) -> b.getCreateTime().compareTo(a.getCreateTime()))
                .collect(Collectors.toList());

        int total = orders.size();
        List<Order> pageOrders = orders.stream().skip(offset).limit(pageSize).collect(Collectors.toList());

        List<Map<String, Object>> list = pageOrders.stream().map(o -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", o.getId());
            m.put("orderId", o.getId());
            m.put("orderNo", o.getOrderNo());
            m.put("riderId", null);
            m.put("riderName", null);
            m.put("riderPhone", null);
            m.put("status", o.getStatus());
            m.put("pickupAddress", "商家地址");
            m.put("deliveryAddress", "用户地址");
            m.put("createTime", o.getCreateTime());
            m.put("updateTime", o.getUpdateTime());
            return m;
        }).collect(Collectors.toList());

        return Result.ok(new PageResult<>(list, total, page, pageSize));
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
        // Return placeholder riders since no rider management exists
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
