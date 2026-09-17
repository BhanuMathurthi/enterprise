package com.enterprise.usermanagement.identity;

import com.enterprise.usermanagement.dto.request.CreateUserRequest;
import com.enterprise.usermanagement.dto.request.UpdateProfileRequest;
import com.enterprise.usermanagement.dto.response.IdentityUserResponse;

/**
 * Common Adapter Interface for Identity Provider Operations.
 * Isolates business logic from downstream identity provider API contracts (Okta, Auth0, Ping, Legacy).
 */
public interface IdentityProviderClient {

    /**
     * Provisions a user in the downstream identity platform.
     * In the new platform, the user is created in PENDING_ACTIVATION / STAGED state.
     */
    IdentityUserResponse provisionUser(CreateUserRequest request);

    /**
     * Retrieves the user record directly from the identity platform.
     */
    IdentityUserResponse getUser(String externalId);

    /**
     * Synchronizes profile updates to the identity platform.
     */
    IdentityUserResponse updateUser(String externalId, UpdateProfileRequest request);

    /**
     * Deactivates or suspends a user in the identity platform.
     */
    void deactivateUser(String externalId);

    /**
     * Returns the name/type of this provider adapter.
     */
    String getProviderType();
}
