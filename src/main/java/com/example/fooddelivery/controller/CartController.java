package com.example.fooddelivery.controller;

import com.example.fooddelivery.entity.Cart;
import com.example.fooddelivery.service.CartService;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Resource
    private CartService cartService;

    // 添加购物车
    @PostMapping("/add")
    public String add(@RequestParam Long userId,
                      @RequestParam Long dishId,
                      @RequestParam Long shopId,
                      @RequestParam Integer quantity){
        cartService.addCart(userId, dishId, shopId, quantity);
        return "success";
    }

    // 修改数量
    @PutMapping("/update")
    public String update(@RequestParam Long id, @RequestParam Integer quantity){
        cartService.updateCartQuantity(id, quantity);
        return "success";
    }

    // 删除单条
    @DeleteMapping("/delete")
    public String delete(@RequestParam Long id){
        cartService.deleteCart(id);
        return "success";
    }

    // 清空购物车
    @DeleteMapping("/clear")
    public String clear(@RequestParam Long userId){
        cartService.clearCart(userId);
        return "success";
    }

    // 查询购物车列表
    @GetMapping("/list")
    public List<Cart> list(@RequestParam Long userId){
        return cartService.getUserCart(userId);
    }
}