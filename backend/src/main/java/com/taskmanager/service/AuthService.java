package com.taskmanager.service;

import com.taskmanager.dto.AuthResponse;
import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.RegisterRequest;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already in use");

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        // Always hash the password before saving - NEVER store plain text
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        // Default to MEMBER if no role provided
        if (req.getRole() != null && req.getRole().equalsIgnoreCase("ADMIN"))
            user.setRole(User.Role.ADMIN);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return buildResponse(user, token);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Compare the plain password against the stored hash
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generateToken(user.getEmail());
        return buildResponse(user, token);
    }

    // Helper to build the response object from a User entity
    private AuthResponse buildResponse(User user, String token) {
        return new AuthResponse(token,
                new AuthResponse.UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole().name()));
    }
}
