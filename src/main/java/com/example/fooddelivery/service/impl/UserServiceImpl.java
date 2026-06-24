package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.dto.UserLoginDTO;
import com.example.fooddelivery.dto.UserRegisterDTO;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.UserMapper;
import com.example.fooddelivery.service.UserService;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    private UserMapper userMapper;

    @Override
    public String register(UserRegisterDTO dto) {
        User existUser = userMapper.selectByUsername(dto.getUsername());
        if (existUser != null) {
            throw new RuntimeException("该用户名已被注册");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getNickname());
        userMapper.insert(user);
        return "注册成功";
    }

    @Override
    public String login(UserLoginDTO dto) {
        User user = userMapper.selectByUsername(dto.getUsername());
        if (user == null || !user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        // 简易Token，后续可升级JWT
        return UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public void updateUser(Long userId, UserRegisterDTO dto) {
        User user = new User();
        user.setId(userId);
        user.setEmail(dto.getNickname());
        user.setPhone(dto.getPhone());
        userMapper.updateById(user);
    }
}