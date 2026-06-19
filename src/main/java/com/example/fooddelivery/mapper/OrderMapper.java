package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {

    int insert(Order order);

    Order selectById(@Param("id") Long id);

    Order selectByOrderNo(@Param("orderNo") String orderNo);

    List<Order> selectByUserId(@Param("userId") Long userId, @Param("status") Integer status);

    int updateStatus(@Param("id") Long id, @Param("status") Integer status);

    int updatePayTime(@Param("id") Long id);
}
