package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.entity.Shop;
import com.example.fooddelivery.mapper.ShopMapper;
import com.example.fooddelivery.service.ShopService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {

    private final ShopMapper shopMapper;

    public ShopServiceImpl(ShopMapper shopMapper) {
        this.shopMapper = shopMapper;
    }

    @Override
    public List<Shop> queryShopPage(Integer pageNum, Integer pageSize) {
        int offset = (pageNum - 1) * pageSize;
        return shopMapper.selectShopPage(offset, pageSize);
    }

    @Override
    public List<Shop> queryShopByCategory(Long categoryId, Integer pageNum, Integer pageSize) {
        int offset = (pageNum - 1) * pageSize;
        return shopMapper.selectShopByCategory(categoryId, offset, pageSize);
    }

    @Override
    public Shop getShopById(Long shopId) {
        return shopMapper.selectShopById(shopId);
    }
}
