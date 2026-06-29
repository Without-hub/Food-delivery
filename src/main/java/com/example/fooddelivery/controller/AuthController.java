package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.dto.UserLoginDTO;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.UserMapper;
import com.example.fooddelivery.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Resource
    private UserService userService;

    @Resource
    private UserMapper userMapper;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody UserLoginDTO dto) {
        String token = userService.login(dto);
        // Find user by username to return userInfo
        User user = userMapper.selectByUsername(dto.getUsername());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("userInfo", user);
        return Result.ok(result);
    }

    @GetMapping("/current-user")
    public Result<User> currentUser(@RequestHeader("userId") String userId) {
        User user = userMapper.selectById(Long.valueOf(userId));
        return Result.ok(user);
    }
}
