package com.example.fooddelivery.controller;

import com.example.fooddelivery.config.SecurityUtil;
import com.example.fooddelivery.dto.UserLoginDTO;
import com.example.fooddelivery.dto.UserRegisterDTO;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.service.UserService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 用户注册
    @PostMapping("/register")
    public Result<String> register(@Validated @RequestBody UserRegisterDTO dto) {
        String res = userService.register(dto);
        return Result.ok(res);
    }

    // 用户登录
    @PostMapping("/login")
    public Result<String> login(@RequestBody UserLoginDTO dto) {
        String token = userService.login(dto);
        return Result.ok(token);
    }

    // 获取当前登录人信息
    @GetMapping("/info")
    public Result<User> getUserInfo() {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userService.getUserById(userId);
        return Result.ok(user);
    }

    // 修改个人信息
    @PutMapping("/info")
    public Result<String> updateInfo(@RequestBody UserRegisterDTO dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        userService.updateUser(userId, dto);
        return Result.ok("修改信息成功");
    }
}
