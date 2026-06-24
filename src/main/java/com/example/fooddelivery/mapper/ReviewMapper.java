package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.Review;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ReviewMapper {
    void insert(Review review);
    Review selectById(Long id);
    void deleteById(Long id);
    List<Review> selectByDishId(Long dishId);
    List<Review> selectByUserId(Long userId);
    Review selectByUserAndOrder(@org.apache.ibatis.annotations.Param("userId") Long userId,
                                @org.apache.ibatis.annotations.Param("orderId") Long orderId);
    Double selectAvgRatingByDishId(@org.apache.ibatis.annotations.Param("dishId") Long dishId);
}