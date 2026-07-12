package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.mapper.DishMapper;
import com.example.fooddelivery.mapper.OrderMapper;
import com.example.fooddelivery.mapper.ShopMapper;
import com.example.fooddelivery.mapper.UserMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final OrderMapper orderMapper;
    private final UserMapper userMapper;
    private final ShopMapper shopMapper;
    private final DishMapper dishMapper;

    public DashboardController(OrderMapper orderMapper, UserMapper userMapper,
                               ShopMapper shopMapper, DishMapper dishMapper) {
        this.orderMapper = orderMapper;
        this.userMapper = userMapper;
        this.shopMapper = shopMapper;
        this.dishMapper = dishMapper;
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        Map<String, Object> data = new LinkedHashMap<>();

        int todayOrders = orderMapper.countTodayOrders();
        BigDecimal todayRevenue = orderMapper.sumTodayRevenue();
        int todayUsers = userMapper.countTodayUsers();
        long totalOrders = orderMapper.countAllOrders();
        BigDecimal totalRevenue = orderMapper.sumTotalRevenue();
        long totalUsers = userMapper.countTotalUsers();
        int totalShops = shopMapper.countShops(null, null);
        int totalDishes = dishMapper.countAdminDishes(null, null);

        data.put("todayOrderCount", todayOrders);
        data.put("todayRevenue", todayRevenue);
        data.put("todayNewUsers", todayUsers);
        data.put("totalOrders", (int) totalOrders);
        data.put("totalRevenue", totalRevenue);
        data.put("totalUsers", (int) totalUsers);
        data.put("totalShops", totalShops);
        data.put("totalDishes", totalDishes);

        // Order status distribution
        List<Map<String, Object>> statusDist = orderMapper.groupOrdersByStatus();
        if (statusDist == null) statusDist = new ArrayList<>();
        data.put("orderStatusDistribution", statusDist.stream().map(m -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("status", m.get("status"));
            item.put("count", ((Number) m.get("count")).intValue());
            return item;
        }).toList());

        // Daily revenue last 7 days
        List<Map<String, Object>> dailyRevenue = orderMapper.dailyRevenueLast7Days();
        if (dailyRevenue == null) dailyRevenue = new ArrayList<>();
        data.put("dailyRevenue", dailyRevenue.stream().map(m -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", m.get("date") != null ? m.get("date").toString().substring(5) : "");
            item.put("revenue", m.get("revenue"));
            return item;
        }).toList());

        // Top 5 dishes
        List<Map<String, Object>> topDishes = orderMapper.selectTopDishes(5);
        if (topDishes == null) topDishes = new ArrayList<>();
        data.put("topDishes", topDishes.stream().map(m -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", m.get("id"));
            item.put("name", m.get("name"));
            item.put("salesCount", m.get("salesCount"));
            return item;
        }).toList());

        return Result.ok(data);
    }
}
