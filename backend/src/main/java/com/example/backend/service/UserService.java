package com.example.backend.service;

import com.example.backend.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Save a user
    User saveUser(User user);

    // Get all users
    List<User> getAllUsers();

    // Get a user by ID
    Optional<User> getUserById(Long id);

    // Get a user by username
    Optional<User> getUserByUsername(String username);

    // Delete a user by ID
    void deleteUser(Long id);
}
