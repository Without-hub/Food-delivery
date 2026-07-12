package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Shop;
import com.example.fooddelivery.service.ShopService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("/list")
    public Result<List<Shop>> getShopList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.ok(shopService.queryShopPage(pageNum, pageSize));
    }

    @GetMapping("/filter/category")
    public Result<List<Shop>> filterShopByCategory(
            @RequestParam Long categoryId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.ok(shopService.queryShopByCategory(categoryId, pageNum, pageSize));
    }

    @GetMapping("/detail")
    public Result<Shop> getShopDetail(@RequestParam Long shopId) {
        return Result.ok(shopService.getShopById(shopId));
    }
}
