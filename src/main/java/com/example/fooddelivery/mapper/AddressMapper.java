package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.Address;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AddressMapper {

    Address selectById(@Param("id") Long id);

    List<Address> selectByUserId(@Param("userId") Long userId);

    int insert(Address address);

    int update(Address address);

    int deleteById(@Param("id") Long id);

    int clearDefault(@Param("userId") Long userId);

    int setDefault(@Param("id") Long id);

}
