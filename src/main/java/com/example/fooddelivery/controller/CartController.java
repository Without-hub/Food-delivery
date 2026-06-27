package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.CartDTO;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.service.CartService;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Resource
    private CartService cartService;

    @PostMapping("/add")
    public Result<String> add(@RequestParam Long userId,
                              @RequestParam Long dishId,
                              @RequestParam Long shopId,
                              @RequestParam Integer quantity) {
        if (quantity == null || quantity <= 0) {
            return Result.fail("数量必须大于0");
        }
        cartService.addCart(userId, dishId, shopId, quantity);
        return Result.ok("添加成功");
    }

    @PutMapping("/update")
    public Result<String> update(@RequestParam Long id, @RequestParam Integer quantity) {
        if (quantity == null || quantity <= 0) {
            return Result.fail("数量必须大于0");
        }
        cartService.updateCartQuantity(id, quantity);
        return Result.ok("修改成功");
    }

    @DeleteMapping("/delete")
    public Result<String> delete(@RequestParam Long id) {
        cartService.deleteCart(id);
        return Result.ok("删除成功");
    }

    @DeleteMapping("/clear")
    public Result<String> clear(@RequestParam Long userId) {
        cartService.clearCart(userId);
        return Result.ok("已清空");
    }

    @GetMapping("/list")
    public Result<List<CartDTO>> list(@RequestParam Long userId) {
        return Result.ok(cartService.getUserCartWithDish(userId));
    }
}
