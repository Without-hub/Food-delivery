package com.example.fooddelivery.mapper;

import com.example.fooddelivery.dto.CartDTO;
import com.example.fooddelivery.entity.Cart;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {

    List<Cart> selectByUserId(@Param("userId") Long userId);

    List<CartDTO> selectDTOByUserId(@Param("userId") Long userId);

    int deleteByUserId(@Param("userId") Long userId);

    int insert(Cart cart);

    int updateQuantity(@Param("id") Long id, @Param("quantity") Integer quantity);

    int deleteById(@Param("id") Long id);

    Cart selectByUserAndDish(@Param("userId") Long userId, @Param("dishId") Long dishId);
}
