package com.example.fooddelivery;

import com.example.fooddelivery.dto.UserRegisterDTO;
import com.example.fooddelivery.entity.User;
import com.example.fooddelivery.mapper.UserMapper;
import com.example.fooddelivery.service.impl.UserServiceImpl;
import com.example.fooddelivery.config.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @InjectMocks
    private UserServiceImpl userService;

    public UserServiceTest() {
        // Use reflection to inject passwordEncoder since it's a final field
        // In a real scenario, use constructor injection directly
    }

    @Test
    void register_shouldThrowWhenUsernameExists() {
        UserRegisterDTO dto = new UserRegisterDTO();
        dto.setUsername("existing");
        dto.setPassword("123456");

        when(userMapper.selectByUsername("existing")).thenReturn(new User());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> userService.register(dto));
        assertEquals("该用户名已被注册", ex.getMessage());
    }

    @Test
    void register_shouldSucceed() {
        UserRegisterDTO dto = new UserRegisterDTO();
        dto.setUsername("newuser");
        dto.setPassword("password123");
        dto.setPhone("13800000001");
        dto.setNickname("新用户");

        when(userMapper.selectByUsername("newuser")).thenReturn(null);

        String result = userService.register(dto);
        assertEquals("注册成功", result);

        // Verify password is encrypted (not stored as plaintext)
        verify(userMapper).insert(argThat(user ->
                user.getUsername().equals("newuser") &&
                !user.getPassword().equals("password123") && // 不是明文
                user.getPassword().startsWith("$2a$") &&     // BCrypt 哈希格式
                user.getNickname().equals("新用户")
        ));
    }
}
