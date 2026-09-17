package com.enterprise.usermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Enterprise User Management Service
 * 
 * Central integration service for user identity lifecycle,
 * bridging the React Profile Portal with both Legacy and New Third-Party Identity Platforms.
 */
@SpringBootApplication
public class UserManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserManagementApplication.class, args);
    }
}
