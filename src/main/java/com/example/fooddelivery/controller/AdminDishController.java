package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.AdminDishVO;
import com.example.fooddelivery.dto.PageResult;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Dish;
import com.example.fooddelivery.mapper.DishMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dishes")
public class AdminDishController {

    @Resource
    private DishMapper dishMapper;

    @GetMapping
    public Result<PageResult<AdminDishVO>> list(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (page - 1) * pageSize;
        List<AdminDishVO> list = dishMapper.selectAdminDishes(name, status, offset, pageSize);
        int total = dishMapper.countAdminDishes(name, status);
        return Result.ok(new PageResult<>(list, total, page, pageSize));
    }

    @PostMapping
    public Result<Void> create(@RequestBody Dish dish) {
        dishMapper.insertDish(dish);
        return Result.ok();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Dish dish) {
        dish.setId(id);
        dishMapper.updateDish(dish);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        dishMapper.deleteDish(id);
        return Result.ok();
    }
}
