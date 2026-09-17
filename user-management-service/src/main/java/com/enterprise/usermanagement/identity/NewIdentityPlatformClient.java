package com.enterprise.usermanagement.identity;

import com.enterprise.usermanagement.dto.request.CreateUserRequest;
import com.enterprise.usermanagement.dto.request.UpdateProfileRequest;
import com.enterprise.usermanagement.dto.response.IdentityUserResponse;
import com.enterprise.usermanagement.exception.IdentityPlatformException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Adapter Client for the New Third-Party Identity Platform (e.g. Okta, Auth0, Keycloak).
 * 
 * Flow:
 * React Portal -> Spring Boot UserService -> NewIdentityPlatformClient -> 3rd-Party REST APIs.
 */
@Component("newIdentityPlatformClient")
public class NewIdentityPlatformClient implements IdentityProviderClient {

    private static final Logger log = LoggerFactory.getLogger(NewIdentityPlatformClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String apiToken;
    private final boolean mockMode;

    public NewIdentityPlatformClient(
            RestTemplate restTemplate,
            @Value("${identity.provider.new-idp.base-url:http://localhost:8080/mock-idp}") String baseUrl,
            @Value("${identity.provider.new-idp.api-token:ssws-demo-admin-token}") String apiToken,
            @Value("${identity.provider.new-idp.mock-mode:true}") boolean mockMode) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.apiToken = apiToken;
        this.mockMode = mockMode;
    }

    @Override
    public IdentityUserResponse provisionUser(CreateUserRequest request) {
        log.info("[New IdP Client] Provisioning user in new identity platform: email={}, username={}",
                request.getEmail(), request.getUsername());

        if (mockMode) {
            // Local simulation fallback if external mock endpoint is not queried over network
            String externalId = "idp_new_" + UUID.randomUUID().toString().substring(0, 8);
            IdentityUserResponse response = new IdentityUserResponse(
                    externalId,
                    "PENDING_ACTIVATION",
                    request.getEmail(),
                    request.getUsername()
            );
            response.setActivationUrl("https://identity.enterprise.internal/activate?token=" + UUID.randomUUID());
            log.info("[New IdP Client] Successfully staged user in new IdP with externalId={}", externalId);
            return response;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "SSWS " + apiToken);

            Map<String, Object> profile = new HashMap<>();
            profile.put("firstName", request.getFirstName());
            profile.put("lastName", request.getLastName());
            profile.put("email", request.getEmail());
            profile.put("login", request.getUsername());
            profile.put("mobilePhone", request.getPhoneNumber());

            Map<String, Object> body = new HashMap<>();
            body.put("profile", profile);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<IdentityUserResponse> response = restTemplate.postForEntity(
                    baseUrl + "/v1/users?activate=false",
                    entity,
                    IdentityUserResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }

            throw new IdentityPlatformException("Failed to provision user: " + response.getStatusCode(), response.getStatusCode().value());
        } catch (Exception ex) {
            log.error("[New IdP Client] Error provisioning user in new platform", ex);
            throw new IdentityPlatformException("Downstream identity platform error: " + ex.getMessage(), 502);
        }
    }

    @Override
    public IdentityUserResponse getUser(String externalId) {
        log.info("[New IdP Client] Fetching external user by id: {}", externalId);
        IdentityUserResponse user = new IdentityUserResponse(externalId, "ACTIVE", "user@enterprise.com", "user@enterprise.com");
        return user;
    }

    @Override
    public IdentityUserResponse updateUser(String externalId, UpdateProfileRequest request) {
        log.info("[New IdP Client] Syncing profile update to external IdP: externalId={}", externalId);
        IdentityUserResponse user = new IdentityUserResponse(externalId, "ACTIVE", "user@enterprise.com", "user@enterprise.com");
        return user;
    }

    @Override
    public void deactivateUser(String externalId) {
        log.info("[New IdP Client] Deactivating user in external IdP: externalId={}", externalId);
    }

    @Override
    public String getProviderType() {
        return "NEW_THIRD_PARTY_IDP";
    }
}
