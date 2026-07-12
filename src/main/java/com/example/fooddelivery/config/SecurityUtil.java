package com.example.fooddelivery.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 工具类：从 SecurityContext 中获取当前登录用户信息
 */
public class SecurityUtil {

    /**
     * 获取当前登录用户 ID
     * @throws RuntimeException 如果用户未登录
     */
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new RuntimeException("用户未登录");
        }
        return ((UserPrincipal) authentication.getPrincipal()).getUserId();
    }

    /**
     * 获取当前登录用户角色
     */
    public static Integer getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            return 0;
        }
        return ((UserPrincipal) authentication.getPrincipal()).getRole();
    }
}
