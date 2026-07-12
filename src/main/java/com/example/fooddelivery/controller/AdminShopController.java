package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.PageResult;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Shop;
import com.example.fooddelivery.mapper.ShopMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/shops")
public class AdminShopController {

    private final ShopMapper shopMapper;

    public AdminShopController(ShopMapper shopMapper) {
        this.shopMapper = shopMapper;
    }

    @GetMapping
    public Result<PageResult<Shop>> list(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (page - 1) * pageSize;
        List<Shop> list = shopMapper.selectAllShops(name, status, offset, pageSize);
        int total = shopMapper.countShops(name, status);
        return Result.ok(new PageResult<>(list, total, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<Shop> detail(@PathVariable Long id) {
        Shop shop = shopMapper.selectShopById(id);
        return Result.ok(shop);
    }

    @PatchMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody(required = false) Shop body) {
        Integer status = (body != null) ? body.getStatus() : null;
        if (status == null) status = 1;
        shopMapper.updateShopStatus(id, status);
        return Result.ok();
    }
}
