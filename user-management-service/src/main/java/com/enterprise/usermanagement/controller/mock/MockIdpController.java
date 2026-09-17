package com.enterprise.usermanagement.controller.mock;

import com.enterprise.usermanagement.dto.response.IdentityUserResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Embedded Mock Controller simulating Third-Party Identity Platform REST APIs.
 * (e.g. Okta / Auth0 / Keycloak User APIs)
 * 
 * Allows local developer testing without requiring external cloud accounts.
 */
@RestController
@RequestMapping("/mock-idp/v1/users")
public class MockIdpController {

    private static final Logger log = LoggerFactory.getLogger(MockIdpController.class);

    @PostMapping
    public ResponseEntity<IdentityUserResponse> mockCreateUser(
            @RequestParam(defaultValue = "false") boolean activate,
            @RequestBody Map<String, Object> body) {

        @SuppressWarnings("unchecked")
        Map<String, Object> profile = (Map<String, Object>) body.getOrDefault("profile", Map.of());

        String email = String.valueOf(profile.getOrDefault("email", "unknown@enterprise.com"));
        String login = String.valueOf(profile.getOrDefault("login", email));
        String externalId = "00u" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);

        log.info("[Mock IdP Server] Received provision request for email={}, activate={}", email, activate);

        IdentityUserResponse response = new IdentityUserResponse(
                externalId,
                activate ? "ACTIVE" : "PENDING_ACTIVATION",
                email,
                login
        );
        response.setActivationUrl("https://identity.enterprise.internal/welcome?token=" + UUID.randomUUID());
        response.setRawAttributes(profile);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IdentityUserResponse> mockGetUser(@PathVariable String id) {
        log.info("[Mock IdP Server] GET user {}", id);
        IdentityUserResponse user = new IdentityUserResponse(id, "ACTIVE", "user@enterprise.com", "user@enterprise.com");
        return ResponseEntity.ok(user);
    }
}
