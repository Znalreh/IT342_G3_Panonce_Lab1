package com.example.backend.controller;

import com.example.backend.dto.UserResponse;
import com.example.backend.entity.User;
import com.example.backend.service.AuthService;
import com.example.backend.service.UserService;
import com.example.backend.util.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*") // allows frontend access
public class UserController {

    private final UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtProvider jwtProvider;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ========================
    // GET CURRENT USER (PROTECTED)
    // ========================
    @GetMapping("/api/user/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid authorization header");
            }

            String token = authHeader.substring(7);

            // Validate token
            if (!jwtProvider.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            // Extract username from token
            String username = jwtProvider.getUsernameFromToken(token);
            Optional<User> userOptional = authService.getUserByUsername(username);

            if (!userOptional.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }

            User user = userOptional.get();
            UserResponse response = new UserResponse(user.getUserId(), user.getUsername(), 
                                                     user.getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: " + e.getMessage());
        }
    }

    // ========================
    // CREATE USER
    // ========================
    @PostMapping("/api/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // ========================
    // GET ALL USERS
    // ========================
    @GetMapping("/api/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ========================
    // GET USER BY ID
    // ========================
    @GetMapping("/api/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ========================
    // DELETE USER
    // ========================
    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
