package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// Sent back to frontend after login/register
// Contains the JWT token + basic user info
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
    }
}
