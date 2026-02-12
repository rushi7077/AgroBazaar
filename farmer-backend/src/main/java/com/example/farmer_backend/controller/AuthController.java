package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.LoginRequest;
import com.example.farmer_backend.dto.RegisterRequest;
import com.example.farmer_backend.model.Role;
import com.example.farmer_backend.model.User;
import com.example.farmer_backend.repository.RoleRepository;
import com.example.farmer_backend.repository.UserRepository;
import com.example.farmer_backend.security.JwtUtil;

import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        // 🚫 BLOCK ADMIN REGISTRATION
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            throw new RuntimeException("Admin registration is not allowed");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        String cleanRole = request.getRole().trim();

        Role role = roleRepository.findByNameIgnoreCase(cleanRole)
                .orElseThrow(() -> new RuntimeException("Role not configured"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(
                    user
            );


            return ResponseEntity.ok(Map.of("token", token));

        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }
    }

    // 🌍 Public endpoint for frontend dropdown
    @GetMapping("/public/roles")
    public ResponseEntity<?> getRoles() {
        return ResponseEntity.ok(List.of("USER", "FARMER"));
    }
}
