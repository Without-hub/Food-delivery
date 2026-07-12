package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.config.SnowflakeIdGenerator;
import com.example.fooddelivery.dto.OrderDTO;
import com.example.fooddelivery.dto.OrderItemDTO;
import com.example.fooddelivery.entity.*;
import com.example.fooddelivery.mapper.*;
import com.example.fooddelivery.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final CartMapper cartMapper;
    private final DishMapper dishMapper;
    private final AddressMapper addressMapper;
    private final ReviewMapper reviewMapper;
    private final SnowflakeIdGenerator idGenerator;

    public OrderServiceImpl(OrderMapper orderMapper, OrderItemMapper orderItemMapper,
                            CartMapper cartMapper, DishMapper dishMapper, AddressMapper addressMapper,
                            ReviewMapper reviewMapper, SnowflakeIdGenerator idGenerator) {
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.cartMapper = cartMapper;
        this.dishMapper = dishMapper;
        this.addressMapper = addressMapper;
        this.reviewMapper = reviewMapper;
        this.idGenerator = idGenerator;
    }

    @Override
    @Transactional
    public OrderDTO createOrder(Long userId, Long addressId, String remark) {
        // 1. 获取购物车
        List<Cart> cartItems = cartMapper.selectByUserId(userId);
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("购物车为空，无法下单");
        }

        // 2. 验证地址
        Address address = addressMapper.selectById(addressId);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new RuntimeException("收货地址无效");
        }

        // 3. 计算订单金额
        Long shopId = cartItems.get(0).getShopId();
        List<Long> dishIds = cartItems.stream().map(Cart::getDishId).collect(Collectors.toList());
        List<Dish> dishes = dishMapper.selectByIds(dishIds);
        Map<Long, Dish> dishMap = dishes.stream().collect(Collectors.toMap(Dish::getId, d -> d));

        BigDecimal deliveryFee = BigDecimal.ZERO;
        BigDecimal itemsTotal = BigDecimal.ZERO;

        for (Cart cartItem : cartItems) {
            Dish dish = dishMap.get(cartItem.getDishId());
            if (dish == null || dish.getStatus() == 0) {
                throw new RuntimeException("菜品【" + (dish == null ? "已删除" : dish.getName()) + "】已下架");
            }
            itemsTotal = itemsTotal.add(dish.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        BigDecimal totalPrice = itemsTotal.add(deliveryFee);

        // 4. 生成订单编号（雪花算法，分布式唯一）
        String orderNo = idGenerator.nextOrderNo();

        // 5. 创建订单
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setShopId(shopId);
        order.setAddressId(addressId);
        order.setTotalPrice(totalPrice);
        order.setDeliveryFee(deliveryFee);
        order.setStatus(0); // 待支付
        order.setRemark(remark);
        orderMapper.insert(order);

        // 6. 创建订单明细
        List<OrderItem> orderItems = new ArrayList<>();
        for (Cart cartItem : cartItems) {
            Dish dish = dishMap.get(cartItem.getDishId());
            OrderItem item = new OrderItem();
            item.setOrderId(order.getId());
            item.setDishId(dish.getId());
            item.setDishName(dish.getName());
            item.setDishImage(dish.getImage());
            item.setPrice(dish.getPrice());
            item.setQuantity(cartItem.getQuantity());
            item.setSubtotal(dish.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItems.add(item);
        }
        orderItemMapper.insertBatch(orderItems);

        // 7. 清空购物车
        cartMapper.deleteByUserId(userId);

        // 8. 返回订单详情
        return buildOrderDTO(order, address, orderItems);
    }

    @Override
    public List<OrderDTO> listOrders(Long userId, Integer status) {
        List<Order> orders = orderMapper.selectByUserId(userId, status);
        List<Long> allOrderIds = orders.stream().map(Order::getId).collect(Collectors.toList());
        List<Long> reviewedIds = allOrderIds.isEmpty() ? List.of() :
                reviewMapper.selectReviewedOrderIds(userId, allOrderIds);
        java.util.Set<Long> reviewedSet = new java.util.HashSet<>(reviewedIds);
        return orders.stream().map(o -> {
            OrderDTO dto = buildOrderDTO(o, null, null);
            dto.setHasReview(reviewedSet.contains(o.getId()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderDetail(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        List<OrderItem> items = orderItemMapper.selectByOrderId(orderId);
        Address address = addressMapper.selectById(order.getAddressId());
        return buildOrderDTO(order, address, items);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作该订单");
        }
        if (order.getStatus() != 0) {
            throw new RuntimeException("仅待支付订单可取消");
        }
        orderMapper.updateStatus(orderId, 4);
    }

    @Override
    public void updateOrderStatus(Long orderId, Integer newStatus) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }
        if (order.getStatus() == 4) {
            throw new RuntimeException("已取消的订单无法修改状态");
        }
        if (order.getStatus() == 3) {
            throw new RuntimeException("已完成的订单无法修改状态");
        }
        orderMapper.updateStatus(orderId, newStatus);
    }

    private OrderDTO buildOrderDTO(Order order, Address address, List<OrderItem> items) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNo(order.getOrderNo());
        dto.setUserId(order.getUserId());
        dto.setShopId(order.getShopId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setStatus(order.getStatus());
        dto.setStatusText(OrderDTO.statusText(order.getStatus()));
        dto.setRemark(order.getRemark());
        dto.setCreateTime(order.getCreateTime());
        dto.setPayTime(order.getPayTime());
        dto.setDeliveryTime(order.getDeliveryTime());
        dto.setCompleteTime(order.getCompleteTime());

        if (address != null) {
            dto.setAddressDetail(address.getProvince() + address.getCity()
                    + address.getDistrict() + " " + address.getDetail());
            dto.setContactName(address.getContactName());
            dto.setContactPhone(address.getContactPhone());
        }

        if (items != null) {
            List<OrderItemDTO> itemDTOs = items.stream().map(i -> {
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setDishId(i.getDishId());
                itemDTO.setDishName(i.getDishName());
                itemDTO.setDishImage(i.getDishImage());
                itemDTO.setPrice(i.getPrice());
                itemDTO.setQuantity(i.getQuantity());
                itemDTO.setSubtotal(i.getSubtotal());
                return itemDTO;
            }).collect(Collectors.toList());
            dto.setItems(itemDTOs);
        }

        return dto;
    }
}
