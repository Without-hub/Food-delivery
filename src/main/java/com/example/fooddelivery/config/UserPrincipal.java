package com.example.fooddelivery.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * 当前登录用户主体，可从 SecurityContext 中获取
 */
public class UserPrincipal implements Authentication {

    private final Long userId;
    private final Integer role;
    private final Collection<? extends GrantedAuthority> authorities;
    private boolean authenticated = true;

    public UserPrincipal(Long userId, Integer role, Collection<? extends GrantedAuthority> authorities) {
        this.userId = userId;
        this.role = role;
        this.authorities = authorities;
    }

    public Long getUserId() {
        return userId;
    }

    public Integer getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return this;
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        return String.valueOf(userId);
    }
}
