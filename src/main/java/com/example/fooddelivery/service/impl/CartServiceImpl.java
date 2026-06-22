package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.entity.Cart;
import com.example.fooddelivery.mapper.CartMapper;
import com.example.fooddelivery.service.CartService;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {
    @Resource
    private CartMapper cartMapper;

    @Override
    public void addCart(Long userId, Long dishId, Long shopId, Integer quantity) {
        Cart existCart = cartMapper.selectByUserAndDish(userId, dishId);
        if(existCart != null){
            int newNum = existCart.getQuantity() + quantity;
            cartMapper.updateQuantity(existCart.getId(), newNum);
        }else{
            Cart cart = new Cart();
            cart.setUserId(userId);
            cart.setDishId(dishId);
            cart.setShopId(shopId);
            cart.setQuantity(quantity);
            cart.setCreateTime(LocalDateTime.now());
            cartMapper.insert(cart);
        }
    }

    @Override
    public void updateCartQuantity(Long id, Integer quantity) {
        cartMapper.updateQuantity(id, quantity);
    }

    @Override
    public void deleteCart(Long id) {
        cartMapper.deleteById(id);
    }

    @Override
    public void clearCart(Long userId) {
        cartMapper.deleteByUserId(userId);
    }

    @Override
    public List<Cart> getUserCart(Long userId) {
        return cartMapper.selectByUserId(userId);
    }
}