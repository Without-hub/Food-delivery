package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.AddressDTO;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Address;
import com.example.fooddelivery.service.AddressService;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {
    @Resource
    private AddressService addressService;

    // 新增地址
    @PostMapping
    public Result<String> add(@RequestBody AddressDTO dto, HttpServletRequest request) {
        Long userId = Long.valueOf(request.getHeader("userId"));
        addressService.addAddress(dto, userId);
        return Result.ok("新增地址成功");
    }

    // 查询我的全部地址
    @GetMapping("/list")
    public Result<List<Address>> list(HttpServletRequest request) {
        Long userId = Long.valueOf(request.getHeader("userId"));
        List<Address> list = addressService.listByUserId(userId);
        return Result.ok(list);
    }

    // 修改地址
    @PutMapping("/{id}")
    public Result<String> update(@PathVariable Long id, @RequestBody AddressDTO dto, HttpServletRequest request) {
        Long userId = Long.valueOf(request.getHeader("userId"));
        dto.setId(id);
        addressService.updateAddress(dto, userId);
        return Result.ok("修改地址成功");
    }

    // 删除地址
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id, HttpServletRequest request) {
        Long userId = Long.valueOf(request.getHeader("userId"));
        addressService.deleteAddr(id, userId);
        return Result.ok("删除成功");
    }

    // 设置默认地址
    @PutMapping("/default/{id}")
    public Result<String> setDefault(@PathVariable Long id, HttpServletRequest request) {
        Long userId = Long.valueOf(request.getHeader("userId"));
        addressService.setDefault(id, userId);
        return Result.ok("设置默认地址成功");
    }
}