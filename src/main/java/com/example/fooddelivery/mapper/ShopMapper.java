package com.example.fooddelivery.mapper;

import com.example.fooddelivery.entity.Shop;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ShopMapper {
    List<Shop> selectShopPage(@Param("offset") Integer offset, @Param("pageSize") Integer pageSize);
    List<Shop> selectShopByCategory(@Param("categoryId") Long categoryId,
                                    @Param("offset") Integer offset,
                                    @Param("pageSize") Integer pageSize);
    Shop selectShopById(@Param("shopId") Long shopId);

    List<Shop> selectAllShops(@Param("name") String name, @Param("status") Integer status, @Param("offset") int offset, @Param("pageSize") int pageSize);

    int countShops(@Param("name") String name, @Param("status") Integer status);

    int updateShopStatus(@Param("id") Long id, @Param("status") Integer status);
}