package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.CartDTO;
import com.example.fooddelivery.entity.Cart;
import java.util.List;

public interface CartService {
    void addCart(Long userId, Long dishId, Long shopId, Integer quantity);
    void updateCartQuantity(Long id, Integer quantity);
    void deleteCart(Long id);
    void clearCart(Long userId);
    List<Cart> getUserCart(Long userId);
    List<CartDTO> getUserCartWithDish(Long userId);
}