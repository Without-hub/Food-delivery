package com.example.fooddelivery.mapper;

import com.example.fooddelivery.dto.AdminReviewVO;
import com.example.fooddelivery.entity.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ReviewMapper {
    void insert(Review review);
    Review selectById(Long id);
    void deleteById(Long id);
    List<Review> selectByDishId(Long dishId);
    List<Review> selectByUserId(Long userId);
    Review selectByUserAndOrder(@Param("userId") Long userId,
                                @Param("orderId") Long orderId);
    Double selectAvgRatingByDishId(@Param("dishId") Long dishId);
    List<Long> selectReviewedOrderIds(@Param("userId") Long userId,
                                      @Param("orderIds") List<Long> orderIds);

    List<AdminReviewVO> selectAdminReviews(@Param("status") Integer status, @Param("offset") int offset, @Param("pageSize") int pageSize);

    int countAdminReviews(@Param("status") Integer status);

    int updateReply(@Param("id") Long id, @Param("reply") String reply);
}