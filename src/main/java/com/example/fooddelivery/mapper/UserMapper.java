package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

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

    List<User> selectAllUsers(@Param("username") String username, @Param("role") Integer role, @Param("offset") int offset, @Param("pageSize") int pageSize);

    int countUsers(@Param("username") String username, @Param("role") Integer role);

    int updateUserStatus(@Param("id") Long id, @Param("status") Integer status);

    int countTodayUsers();

    long countTotalUsers();
}