package com.enterprise.usermanagement.controller.v2;

import com.enterprise.usermanagement.dto.request.CreateUserRequest;
import com.enterprise.usermanagement.dto.request.UpdateProfileRequest;
import com.enterprise.usermanagement.dto.response.ApiResponse;
import com.enterprise.usermanagement.dto.response.UserProfileResponse;
import com.enterprise.usermanagement.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API v2: Greenfield User Profile Portal Endpoints.
 * 
 * Trace Path:
 * React Portal -> /api/v2/users -> UserProfileController -> UserService -> IdentityProviderFactory -> NewIdP Client
 */
@RestController
@RequestMapping("/api/v2/users")
public class UserProfileController {

    private static final Logger log = LoggerFactory.getLogger(UserProfileController.class);

    private final UserService userService;

    public UserProfileController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Creates a new user profile and provisions the identity in the new third-party identity platform.
     * The user is provisioned in PENDING_ACTIVATION status, ready for first-login factor setup.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("[UserProfileController v2] POST /api/v2/users - Creating user: {}", request.getEmail());
        UserProfileResponse response = userService.createUser(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(response, "User profile registered and staged in Identity Provider successfully."));
    }

    /**
     * Retrieves profile details for a given user.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(@PathVariable String id) {
        log.info("[UserProfileController v2] GET /api/v2/users/{}", id);
        UserProfileResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * Updates profile attributes and synchronizes them to the third-party identity platform.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @PathVariable String id,
            @Valid @RequestBody UpdateProfileRequest request) {
        log.info("[UserProfileController v2] PUT /api/v2/users/{}", id);
        UserProfileResponse response = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Profile attributes updated and synced successfully."));
    }

    /**
     * Lists all users.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> listUsers() {
        log.info("[UserProfileController v2] GET /api/v2/users");
        List<UserProfileResponse> users = userService.listUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }
}
