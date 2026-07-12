package com.example.fooddelivery.controller;

import com.example.fooddelivery.config.SecurityUtil;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.dto.UserLoginDTO;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.UserMapper;
import com.example.fooddelivery.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;

    public AuthController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody UserLoginDTO dto) {
        String token = userService.login(dto);
        User user = userMapper.selectByUsername(dto.getUsername());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("userInfo", user);
        return Result.ok(result);
    }

    @GetMapping("/current-user")
    public Result<User> currentUser() {
        Long userId = SecurityUtil.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return Result.ok(user);
    }
}
