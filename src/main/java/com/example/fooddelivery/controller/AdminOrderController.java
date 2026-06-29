package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.AdminOrderVO;
import com.example.fooddelivery.dto.PageResult;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.mapper.OrderMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Resource
    private OrderMapper orderMapper;

    @GetMapping
    public Result<PageResult<AdminOrderVO>> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String orderNo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (page - 1) * pageSize;
        List<AdminOrderVO> list = orderMapper.selectAdminOrders(status, orderNo, offset, pageSize);
        int total = orderMapper.countAdminOrders(status, orderNo);
        return Result.ok(new PageResult<>(list, total, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<AdminOrderVO> detail(@PathVariable Long id) {
        List<AdminOrderVO> list = orderMapper.selectAdminOrders(null, null, 0, 10000);
        AdminOrderVO order = list.stream().filter(o -> o.getId().equals(id)).findFirst().orElse(null);
        return Result.ok(order);
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        orderMapper.updateStatus(id, status);
        return Result.ok();
    }

    @PutMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        orderMapper.updateStatus(id, 4);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        orderMapper.deleteById(id);
        return Result.ok();
    }
}
