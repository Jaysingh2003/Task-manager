package com.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Used for POST /api/auth/register
@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @Email @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String role; // "ADMIN" or "MEMBER"
}
