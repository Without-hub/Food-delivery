package com.example.fooddelivery.service;

import com.example.fooddelivery.entity.Category;
import com.example.fooddelivery.entity.Dish;
import java.util.List;

public interface DishService {
    List<Category> queryCategoryByShopId(Long shopId);
    List<Dish> queryDishPage(Long shopId, String keyword, Integer pageNum, Integer pageSize);
    Dish getDishById(Long dishId);
}