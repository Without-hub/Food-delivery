package com.example.fooddelivery.mapper;

import com.example.fooddelivery.dto.AdminDishVO;
import com.example.fooddelivery.entity.Category;
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

    List<Dish> selectDishPage(@Param("shopId") Long shopId,
                              @Param("keyword") String keyword,
                              @Param("offset") Integer offset,
                              @Param("pageSize") Integer pageSize);

    List<Category> selectCategoryByShopId(@Param("shopId") Long shopId);

    List<AdminDishVO> selectAdminDishes(@Param("name") String name, @Param("status") Integer status, @Param("offset") int offset, @Param("pageSize") int pageSize);

    int countAdminDishes(@Param("name") String name, @Param("status") Integer status);

    int insertDish(Dish dish);

    int updateDish(Dish dish);

    int deleteDish(@Param("id") Long id);
}
