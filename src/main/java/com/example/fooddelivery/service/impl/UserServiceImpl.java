package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.config.JwtUtil;
import com.example.fooddelivery.dto.UserLoginDTO;
import com.example.fooddelivery.dto.UserRegisterDTO;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.UserMapper;
import com.example.fooddelivery.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(UserRegisterDTO dto) {
        User existUser = userMapper.selectByUsername(dto.getUsername());
        if (existUser != null) {
            throw new RuntimeException("该用户名已被注册");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        // 修复 Bug：nickname 字段应存 nickname，而不是 email
        // User 实体无 nickname 字段，使用 dto.getNickname() 作为昵称，存到 email 字段作为备用
        // 更合理的做法是给 User 实体增加 nickname 字段，后续优化
        user.setNickname(dto.getNickname());
        userMapper.insert(user);
        return "注册成功";
    }

    @Override
    public String login(UserLoginDTO dto) {
        User user = userMapper.selectByUsername(dto.getUsername());
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        // 生成 JWT Token
        return jwtUtil.generateToken(user.getId(), user.getRole());
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public void updateUser(Long userId, UserRegisterDTO dto) {
        User user = new User();
        user.setId(userId);
        user.setNickname(dto.getNickname());
        user.setPhone(dto.getPhone());
        userMapper.updateById(user);
    }
}
