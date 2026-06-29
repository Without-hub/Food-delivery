package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {

    List<Category> selectAll();

    int insert(Category category);

    int updateById(Category category);

    int deleteById(@Param("id") Long id);
}
