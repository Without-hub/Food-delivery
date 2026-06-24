package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.entity.Category;
import com.example.fooddelivery.entity.Dish;
import com.example.fooddelivery.mapper.DishMapper;
import com.example.fooddelivery.service.DishService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@Service
public class DishServiceImpl implements DishService {
    @Autowired
    private DishMapper dishMapper;

    @Override
    public List<Category> queryCategoryByShopId(Long shopId) {
        return dishMapper.selectCategoryByShopId(shopId);
    }

    @Override
    public List<Dish> queryDishPage(Long shopId, String keyword, Integer pageNum, Integer pageSize) {
        int offset = (pageNum - 1) * pageSize;
        return dishMapper.selectDishPage(shopId, keyword, offset, pageSize);
    }

    @Override
    public Dish getDishById(Long dishId) {
        return dishMapper.selectById(dishId);
    }
}