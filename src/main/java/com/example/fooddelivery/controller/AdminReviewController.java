package com.example.fooddelivery.controller;

import com.example.fooddelivery.dto.AdminReviewVO;
import com.example.fooddelivery.dto.PageResult;
import com.example.fooddelivery.dto.Result;
import com.example.fooddelivery.mapper.ReviewMapper;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    @Resource
    private ReviewMapper reviewMapper;

    @GetMapping
    public Result<PageResult<AdminReviewVO>> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        int offset = (page - 1) * pageSize;
        List<AdminReviewVO> list = reviewMapper.selectAdminReviews(status, offset, pageSize);
        int total = reviewMapper.countAdminReviews(status);
        return Result.ok(new PageResult<>(list, total, page, pageSize));
    }

    @PutMapping("/{id}/reply")
    public Result<Void> reply(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String content = body.get("content");
        reviewMapper.updateReply(id, content);
        return Result.ok();
    }

    @PatchMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        // Review table has no status column, this is a no-op
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        reviewMapper.deleteById(id);
        return Result.ok();
    }
}
