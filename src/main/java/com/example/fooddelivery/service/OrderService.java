package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.OrderDTO;

import java.util.List;

public interface OrderService {

    /** 提交订单（事务：购物车 → 订单 + 明细 + 清空购物车） */
    OrderDTO createOrder(Long userId, Long addressId, String remark);

    /** 查询用户订单列表，可筛选状态 */
    List<OrderDTO> listOrders(Long userId, Integer status);

    /** 查询订单详情（含明细） */
    OrderDTO getOrderDetail(Long orderId);

    /** 取消订单（仅待支付状态可取消） */
    void cancelOrder(Long orderId, Long userId);

    /** 修改订单状态（管理端操作） */
    void updateOrderStatus(Long orderId, Integer newStatus);
}
