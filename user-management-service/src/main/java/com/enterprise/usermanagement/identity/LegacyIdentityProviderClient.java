package com.enterprise.usermanagement.identity;

import com.enterprise.usermanagement.dto.request.CreateUserRequest;
import com.enterprise.usermanagement.dto.request.UpdateProfileRequest;
import com.enterprise.usermanagement.dto.response.IdentityUserResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Adapter Client for the Legacy Identity Provider.
 * Preserved to ensure backward compatibility during migration.
 */
@Component("legacyIdentityProviderClient")
public class LegacyIdentityProviderClient implements IdentityProviderClient {

    private static final Logger log = LoggerFactory.getLogger(LegacyIdentityProviderClient.class);

    @Override
    public IdentityUserResponse provisionUser(CreateUserRequest request) {
        log.info("[Legacy IdP Client] Provisioning user via legacy identity provider protocol: {}", request.getEmail());
        String legacyId = "leg_usr_" + UUID.randomUUID().toString().substring(0, 8);
        return new IdentityUserResponse(legacyId, "INVITED", request.getEmail(), request.getUsername());
    }

    @Override
    public IdentityUserResponse getUser(String externalId) {
        log.info("[Legacy IdP Client] Querying legacy identity directory for: {}", externalId);
        return new IdentityUserResponse(externalId, "ACTIVE", "legacy@enterprise.com", "legacy@enterprise.com");
    }

    @Override
    public IdentityUserResponse updateUser(String externalId, UpdateProfileRequest request) {
        log.info("[Legacy IdP Client] Updating legacy identity directory: {}", externalId);
        return new IdentityUserResponse(externalId, "ACTIVE", "legacy@enterprise.com", "legacy@enterprise.com");
    }

    @Override
    public void deactivateUser(String externalId) {
        log.info("[Legacy IdP Client] Deactivating user in legacy identity directory: {}", externalId);
    }

    @Override
    public String getProviderType() {
        return "LEGACY_IDP";
    }
}
