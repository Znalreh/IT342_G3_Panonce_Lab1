package com.example.backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StartupConfig {

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> {
            System.out.println("\n\n");
            System.out.println("=========================================");
            System.out.println("✅ Spring Boot Application Started!");
            System.out.println("✅ Server running on: http://localhost:8080");
            System.out.println("=========================================");
            System.out.println("Available Endpoints:");
            System.out.println("  POST   /api/auth/register");
            System.out.println("  POST   /api/auth/login");
            System.out.println("  GET    /api/user/me (requires token)");
            System.out.println("  GET    /api/users");
            System.out.println("  POST   /api/users");
            System.out.println("  GET    /api/users/{id}");
            System.out.println("  DELETE /api/users/{id}");
            System.out.println("=========================================\n\n");
        };
    }
}
