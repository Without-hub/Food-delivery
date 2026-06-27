package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.dto.CartDTO;
import com.example.fooddelivery.entity.Cart;
import com.example.fooddelivery.mapper.CartMapper;
import com.example.fooddelivery.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.Resource;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {
    @Resource
    private CartMapper cartMapper;

    @Override
    @Transactional
    public void addCart(Long userId, Long dishId, Long shopId, Integer quantity) {
        Cart existCart = cartMapper.selectByUserAndDish(userId, dishId);
        if (existCart != null) {
            int newNum = existCart.getQuantity() + quantity;
            cartMapper.updateQuantity(existCart.getId(), newNum);
        } else {
            Cart cart = new Cart();
            cart.setUserId(userId);
            cart.setDishId(dishId);
            cart.setShopId(shopId);
            cart.setQuantity(quantity);
            cartMapper.insert(cart);
        }
    }

    @Override
    @Transactional
    public void updateCartQuantity(Long id, Integer quantity) {
        cartMapper.updateQuantity(id, quantity);
    }

    @Override
    @Transactional
    public void deleteCart(Long id) {
        cartMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartMapper.deleteByUserId(userId);
    }

    @Override
    public List<Cart> getUserCart(Long userId) {
        return cartMapper.selectByUserId(userId);
    }

    @Override
    public List<CartDTO> getUserCartWithDish(Long userId) {
        return cartMapper.selectDTOByUserId(userId);
    }
}
