package com.enterprise.usermanagement.identity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Strategy Selector / Factory implementing the Adapter Pattern.
 * 
 * Manages the coexistence of the Legacy Identity Provider and New Identity Platform.
 * Supports runtime tenant-based or configuration-driven routing during migration.
 */
@Component
public class IdentityProviderFactory {

    private static final Logger log = LoggerFactory.getLogger(IdentityProviderFactory.class);

    private final IdentityProviderClient newClient;
    private final IdentityProviderClient legacyClient;
    private final String activeProviderConfig;

    public IdentityProviderFactory(
            @Qualifier("newIdentityPlatformClient") IdentityProviderClient newClient,
            @Qualifier("legacyIdentityProviderClient") IdentityProviderClient legacyClient,
            @Value("${identity.provider.active:NEW}") String activeProviderConfig) {
        this.newClient = newClient;
        this.legacyClient = legacyClient;
        this.activeProviderConfig = activeProviderConfig;
    }

    /**
     * Resolves the configured identity provider client.
     */
    public IdentityProviderClient getProvider() {
        if ("LEGACY".equalsIgnoreCase(activeProviderConfig)) {
            log.debug("[IdentityProviderFactory] Resolved LEGACY identity provider client");
            return legacyClient;
        }
        log.debug("[IdentityProviderFactory] Resolved NEW third-party identity platform client");
        return newClient;
    }

    /**
     * Resolves client explicitly by type for migration phasing or tenant routing.
     */
    public IdentityProviderClient getProviderByType(String providerType) {
        if ("LEGACY".equalsIgnoreCase(providerType)) {
            return legacyClient;
        }
        return newClient;
    }

    public boolean isNewPlatformActive() {
        return "NEW".equalsIgnoreCase(activeProviderConfig);
    }
}
