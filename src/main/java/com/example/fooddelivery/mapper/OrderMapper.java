package com.example.fooddelivery.mapper;

import com.example.fooddelivery.dto.AdminOrderVO;
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

    List<AdminOrderVO> selectAdminOrders(@Param("status") Integer status, @Param("orderNo") String orderNo, @Param("offset") int offset, @Param("pageSize") int pageSize);

    int countAdminOrders(@Param("status") Integer status, @Param("orderNo") String orderNo);

    int deleteById(@Param("id") Long id);

    int countTodayOrders();

    java.math.BigDecimal sumTodayRevenue();

    long countAllOrders();

    java.math.BigDecimal sumTotalRevenue();

    List<java.util.Map<String, Object>> groupOrdersByStatus();

    List<java.util.Map<String, Object>> dailyRevenueLast7Days();

    List<java.util.Map<String, Object>> selectTopDishes(@Param("limit") int limit);
}
