package com.enterprise.usermanagement.service;

import com.enterprise.usermanagement.dto.request.CreateUserRequest;
import com.enterprise.usermanagement.dto.request.UpdateProfileRequest;
import com.enterprise.usermanagement.dto.response.UserProfileResponse;

import java.util.List;

/**
 * Service Contract for User Profile Management.
 * Orchestrates local data persistence with downstream Identity Provider operations.
 */
public interface UserService {

    /**
     * Provisions a new user in the Identity Provider and registers the local user profile.
     */
    UserProfileResponse createUser(CreateUserRequest request);

    /**
     * Retrieves the profile for a given user ID.
     */
    UserProfileResponse getUserById(String id);

    /**
     * Retrieves the profile by email.
     */
    UserProfileResponse getUserByEmail(String email);

    /**
     * Updates profile attributes and synchronizes them to the downstream Identity Provider.
     */
    UserProfileResponse updateProfile(String id, UpdateProfileRequest request);

    /**
     * Lists all registered user profiles.
     */
    List<UserProfileResponse> listUsers();
}
