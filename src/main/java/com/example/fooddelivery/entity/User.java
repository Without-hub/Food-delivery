package com.example.fooddelivery.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Long id;
    private String username;
    private String password;
    private String nickname;    // 昵称
    private String phone;
    private String email;
    private String avatar;
    private Integer role;       // 0-普通用户, 1-管理员
    private Integer status;     // 0-禁用, 1-启用
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
