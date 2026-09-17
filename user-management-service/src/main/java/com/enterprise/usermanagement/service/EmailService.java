package com.enterprise.usermanagement.service;

/**
 * Service contract for outbound email dispatch.
 */
public interface EmailService {

    /**
     * Dispatches a formatted invitation email containing the single-use onboarding URL.
     *
     * @param recipientEmail destination email address
     * @param role assigned enterprise role scope
     * @param invitationUrl complete registration link
     * @return true if successfully dispatched via SMTP, false otherwise
     */
    boolean sendInvitationEmail(String recipientEmail, String role, String invitationUrl);
}
