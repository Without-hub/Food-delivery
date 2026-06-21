package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.UserLoginDTO;
import com.example.fooddelivery.dto.UserRegisterDTO;
import com.example.fooddelivery.entity.User;

public interface UserService {
    String register(UserRegisterDTO dto);
    String login(UserLoginDTO dto);
    User getUserById(Long userId);
    void updateUser(Long userId, UserRegisterDTO dto);
}