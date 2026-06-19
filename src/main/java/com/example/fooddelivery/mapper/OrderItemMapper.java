package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderItemMapper {

    int insertBatch(@Param("items") List<OrderItem> items);

    List<OrderItem> selectByOrderId(@Param("orderId") Long orderId);
}
