package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    // 根据用户名查询用户（注册查重、登录校验）
    User selectByUsername(String username);
    // 新增用户
    int insert(User user);
    // 根据id查询用户
    User selectById(Long id);
    // 修改用户信息
    int updateById(@Param("user") User user);
}