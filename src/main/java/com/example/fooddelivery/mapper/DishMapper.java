package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.Dish;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DishMapper {

    Dish selectById(@Param("id") Long id);

    List<Dish> selectByIds(@Param("ids") List<Long> ids);

    List<Dish> selectByShopId(@Param("shopId") Long shopId);

    List<Dish> selectByCategoryId(@Param("categoryId") Long categoryId,
                                  @Param("offset") int offset,
                                  @Param("limit") int limit);

    List<Dish> searchByName(@Param("keyword") String keyword);
}
