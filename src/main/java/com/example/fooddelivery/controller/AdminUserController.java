package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.PageResult;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Resource
    private UserMapper userMapper;

    @GetMapping
    public Result<PageResult<User>> list(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) Integer role,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (page - 1) * pageSize;
        List<User> list = userMapper.selectAllUsers(username, role, offset, pageSize);
        int total = userMapper.countUsers(username, role);
        return Result.ok(new PageResult<>(list, total, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<User> detail(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        return Result.ok(user);
    }

    @PatchMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody(required = false) User body) {
        Integer status = (body != null) ? body.getStatus() : null;
        if (status == null) status = 1;
        userMapper.updateUserStatus(id, status);
        return Result.ok();
    }
}
