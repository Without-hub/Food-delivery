package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Category;
import com.example.fooddelivery.mapper.CategoryMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    @Resource
    private CategoryMapper categoryMapper;

    @GetMapping
    public Result<List<Map<String, Object>>> list() {
        List<Category> categories = categoryMapper.selectAll();
        List<Map<String, Object>> result = categories.stream().map(c -> {
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("id", c.getId());
            m.put("name", c.getName());
            m.put("sort", c.getSortOrder());
            m.put("status", 1);
            m.put("createTime", c.getCreateTime());
            m.put("updateTime", c.getCreateTime());
            return m;
        }).collect(Collectors.toList());
        return Result.ok(result);
    }

    @PostMapping
    public Result<Void> create(@RequestBody Map<String, Object> body) {
        Category category = new Category();
        category.setName((String) body.get("name"));
        category.setSortOrder(body.get("sort") != null ? ((Number) body.get("sort")).intValue() : 0);
        category.setShopId(0L);
        categoryMapper.insert(category);
        return Result.ok();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Category category = new Category();
        category.setId(id);
        if (body.containsKey("name")) category.setName((String) body.get("name"));
        if (body.get("sort") != null) category.setSortOrder(((Number) body.get("sort")).intValue());
        categoryMapper.updateById(category);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryMapper.deleteById(id);
        return Result.ok();
    }
}
