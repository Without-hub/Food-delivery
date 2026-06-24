package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Category;
import com.example.fooddelivery.entity.Dish;
import com.example.fooddelivery.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/api/dish")
public class DishController {
    @Autowired
    private DishService dishService;

    @GetMapping("/category/list")
    public Result<List<Category>> getDishCategory(@RequestParam Long shopId) {
        return Result.ok(dishService.queryCategoryByShopId(shopId));
    }

    @GetMapping("/list")
    public Result<List<Dish>> getDishPage(
            @RequestParam Long shopId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.ok(dishService.queryDishPage(shopId, keyword, pageNum, pageSize));
    }

    @GetMapping("/detail")
    public Result<Dish> getDishDetail(@RequestParam Long dishId) {
        return Result.ok(dishService.getDishById(dishId));
    }
}