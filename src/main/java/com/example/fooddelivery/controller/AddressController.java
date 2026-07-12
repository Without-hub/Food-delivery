package com.example.fooddelivery.controller;

import com.example.fooddelivery.config.SecurityUtil;
import com.example.fooddelivery.dto.AddressDTO;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Address;
import com.example.fooddelivery.service.AddressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public Result<String> add(@RequestBody AddressDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        addressService.addAddress(dto, userId);
        return Result.ok("新增地址成功");
    }

    @GetMapping("/list")
    public Result<List<Address>> list() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<Address> list = addressService.listByUserId(userId);
        return Result.ok(list);
    }

    @PutMapping("/{id}")
    public Result<String> update(@PathVariable Long id, @RequestBody AddressDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        dto.setId(id);
        addressService.updateAddress(dto, userId);
        return Result.ok("修改地址成功");
    }

    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        addressService.deleteAddr(id, userId);
        return Result.ok("删除成功");
    }

    @PutMapping("/default/{id}")
    public Result<String> setDefault(@PathVariable Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        addressService.setDefault(id, userId);
        return Result.ok("设置默认地址成功");
    }
}
