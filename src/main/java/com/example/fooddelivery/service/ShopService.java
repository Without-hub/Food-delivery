package com.example.fooddelivery.service;

import com.example.fooddelivery.entity.Shop;
import java.util.List;

public interface ShopService {
    List<Shop> queryShopPage(Integer pageNum, Integer pageSize);
    List<Shop> queryShopByCategory(Long categoryId, Integer pageNum, Integer pageSize);
    Shop getShopById(Long shopId);
}