package com.enterprise.usermanagement.dto.response;

import java.util.Map;

/**
 * Normalized representation of a user in the third-party Identity Platform.
 */
public class IdentityUserResponse {

    private String externalId;
    private String status;
    private String email;
    private String username;
    private String activationUrl;
    private Map<String, Object> rawAttributes;

    public IdentityUserResponse() {
    }

    public IdentityUserResponse(String externalId, String status, String email, String username) {
        this.externalId = externalId;
        this.status = status;
        this.email = email;
        this.username = username;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getActivationUrl() {
        return activationUrl;
    }

    public void setActivationUrl(String activationUrl) {
        this.activationUrl = activationUrl;
    }

    public Map<String, Object> getRawAttributes() {
        return rawAttributes;
    }

    public void setRawAttributes(Map<String, Object> rawAttributes) {
        this.rawAttributes = rawAttributes;
    }
}
