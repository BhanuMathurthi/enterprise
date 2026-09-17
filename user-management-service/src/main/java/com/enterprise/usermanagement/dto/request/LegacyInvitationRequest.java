package com.enterprise.usermanagement.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for the legacy invitation flow (API v1).
 */
public class LegacyInvitationRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Role is required")
    private String role;

    private String customNote;
    private String baseUrl;

    public LegacyInvitationRequest() {
    }

    public LegacyInvitationRequest(String email, String role, String customNote) {
        this.email = email;
        this.role = role;
        this.customNote = customNote;
    }

    public LegacyInvitationRequest(String email, String role, String customNote, String baseUrl) {
        this.email = email;
        this.role = role;
        this.customNote = customNote;
        this.baseUrl = baseUrl;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCustomNote() {
        return customNote;
    }

    public void setCustomNote(String customNote) {
        this.customNote = customNote;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
}
