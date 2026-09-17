package com.enterprise.usermanagement.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "identity.provider")
public class IdentityProviderConfig {

    private String active = "NEW";
    private IdpProperties newIdp = new IdpProperties();
    private IdpProperties legacy = new IdpProperties();

    public static class IdpProperties {
        private String baseUrl;
        private String apiToken;
        private String issuer;
        private String clientId;
        private boolean mockMode = true;

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getApiToken() {
            return apiToken;
        }

        public void setApiToken(String apiToken) {
            this.apiToken = apiToken;
        }

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }

        public boolean isMockMode() {
            return mockMode;
        }

        public void setMockMode(boolean mockMode) {
            this.mockMode = mockMode;
        }
    }

    public String getActive() {
        return active;
    }

    public void setActive(String active) {
        this.active = active;
    }

    public IdpProperties getNewIdp() {
        return newIdp;
    }

    public void setNewIdp(IdpProperties newIdp) {
        this.newIdp = newIdp;
    }

    public IdpProperties getLegacy() {
        return legacy;
    }

    public void setLegacy(IdpProperties legacy) {
        this.legacy = legacy;
    }
}
