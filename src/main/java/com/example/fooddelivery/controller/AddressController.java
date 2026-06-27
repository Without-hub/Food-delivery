package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.AddressDTO;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.Address;
import com.example.fooddelivery.service.AddressService;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {
    @Resource
    private AddressService addressService;

    @PostMapping
    public Result<String> add(@RequestBody AddressDTO dto, @RequestParam Long userId) {
        addressService.addAddress(dto, userId);
        return Result.ok("新增地址成功");
    }

    @GetMapping("/list")
    public Result<List<Address>> list(@RequestParam Long userId) {
        List<Address> list = addressService.listByUserId(userId);
        return Result.ok(list);
    }

    @PutMapping("/{id}")
    public Result<String> update(@PathVariable Long id, @RequestBody AddressDTO dto, @RequestParam Long userId) {
        dto.setId(id);
        addressService.updateAddress(dto, userId);
        return Result.ok("修改地址成功");
    }

    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id, @RequestParam Long userId) {
        addressService.deleteAddr(id, userId);
        return Result.ok("删除成功");
    }

    @PutMapping("/default/{id}")
    public Result<String> setDefault(@PathVariable Long id, @RequestParam Long userId) {
        addressService.setDefault(id, userId);
        return Result.ok("设置默认地址成功");
    }
}
