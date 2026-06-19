package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.OrderDTO;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /** 提交订单 */
    @PostMapping
    public Result<OrderDTO> createOrder(@RequestBody OrderDTO request) {
        // 暂时硬编码 userId=1，后续接入登录后从 Session 获取
        Long userId = 1L;
        OrderDTO order = orderService.createOrder(userId, request.getAddressId(), request.getRemark());
        return Result.ok(order);
    }

    /** 订单列表 */
    @GetMapping
    public Result<List<OrderDTO>> listOrders(@RequestParam(required = false) Integer status) {
        Long userId = 1L;
        List<OrderDTO> orders = orderService.listOrders(userId, status);
        return Result.ok(orders);
    }

    /** 订单详情 */
    @GetMapping("/{id}")
    public Result<OrderDTO> getOrderDetail(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderDetail(id);
        return Result.ok(order);
    }

    /** 取消订单 */
    @PutMapping("/{id}/cancel")
    public Result<Void> cancelOrder(@PathVariable Long id) {
        Long userId = 1L;
        orderService.cancelOrder(id, userId);
        return Result.ok();
    }

    /** 修改订单状态（管理端） */
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        orderService.updateOrderStatus(id, status);
        return Result.ok();
    }
}
