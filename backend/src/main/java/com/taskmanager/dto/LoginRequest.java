package com.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Used for POST /api/auth/login
@Data
public class LoginRequest {
    @Email @NotBlank
    private String email;

    @NotBlank
    private String password;
}
