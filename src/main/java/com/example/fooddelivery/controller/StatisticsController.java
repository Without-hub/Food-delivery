package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.mapper.DishMapper;
import com.example.fooddelivery.mapper.OrderMapper;
import com.example.fooddelivery.mapper.ShopMapper;
import com.example.fooddelivery.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticsController {

    @Resource
    private OrderMapper orderMapper;
    @Resource
    private UserMapper userMapper;
    @Resource
    private ShopMapper shopMapper;
    @Resource
    private DishMapper dishMapper;

    @GetMapping("/summary")
    public Result<Map<String, Object>> summary() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalOrders", (int) orderMapper.countAllOrders());
        data.put("totalRevenue", orderMapper.sumTotalRevenue());
        data.put("totalUsers", (int) userMapper.countTotalUsers());
        data.put("totalShops", shopMapper.countShops(null, null));
        return Result.ok(data);
    }

    @GetMapping("/revenue-trend")
    public Result<List<Map<String, Object>>> revenueTrend() {
        List<Map<String, Object>> list = orderMapper.dailyRevenueLast7Days();
        if (list == null) list = new ArrayList<>();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> m : list) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("date", m.get("date") != null ? m.get("date").toString().substring(5) : "");
            item.put("revenue", m.get("revenue"));
            item.put("orderCount", 0);
            result.add(item);
        }
        return Result.ok(result);
    }

    @GetMapping("/order-status-distribution")
    public Result<List<Map<String, Object>>> orderStatusDistribution() {
        List<Map<String, Object>> list = orderMapper.groupOrdersByStatus();
        if (list == null) list = new ArrayList<>();
        String[] names = {"待支付", "已支付/待接单", "配送中", "已完成", "已取消"};
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> m : list) {
            Map<String, Object> item = new LinkedHashMap<>();
            int status = ((Number) m.get("status")).intValue();
            item.put("name", status < names.length ? names[status] : "未知");
            item.put("value", m.get("count"));
            result.add(item);
        }
        return Result.ok(result);
    }

    @GetMapping("/top-dishes")
    public Result<List<Map<String, Object>>> topDishes() {
        List<Map<String, Object>> list = orderMapper.selectTopDishes(10);
        if (list == null) list = new ArrayList<>();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> m : list) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", m.get("name"));
            item.put("category", "");
            item.put("salesCount", m.get("salesCount"));
            item.put("revenue", 0);
            result.add(item);
        }
        return Result.ok(result);
    }

    @GetMapping("/shop-rankings")
    public Result<List<Map<String, Object>>> shopRankings() {
        List<com.example.fooddelivery.entity.Shop> shops = shopMapper.selectAllShops(null, null, 0, 5);
        List<Map<String, Object>> result = new ArrayList<>();
        for (com.example.fooddelivery.entity.Shop s : shops) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", s.getName());
            item.put("orderCount", s.getSalesVolume() != null ? s.getSalesVolume() : 0);
            item.put("revenue", 0);
            item.put("rating", s.getRating() != null ? s.getRating().doubleValue() : 0);
            result.add(item);
        }
        return Result.ok(result);
    }
}
