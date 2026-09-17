package com.enterprise.usermanagement.service;

import com.enterprise.usermanagement.dto.request.LegacyInvitationRequest;
import com.enterprise.usermanagement.model.UserEntity;
import com.enterprise.usermanagement.model.UserStatus;
import com.enterprise.usermanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Service managing the Legacy Invitation Flow (API v1).
 * 
 * Maintained for backward compatibility with older enterprise applications
 * that still depend on the invitation link generation model.
 */
@Service
@Transactional
public class LegacyInvitationService {

    private static final Logger log = LoggerFactory.getLogger(LegacyInvitationService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:}")
    private String defaultFrontendUrl;

    public LegacyInvitationService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public Map<String, Object> createInvitation(LegacyInvitationRequest request) {
        log.info("[LegacyInvitationService] Creating legacy invitation for email={}, baseUrl={}", request.getEmail(), request.getBaseUrl());

        String invitationToken = UUID.randomUUID().toString();
        String invitationId = "inv-" + UUID.randomUUID().toString().substring(0, 8);

        // In legacy flow, a stub user entity is created with status INVITED
        if (!userRepository.existsByEmail(request.getEmail())) {
            UserEntity stub = new UserEntity();
            stub.setId("usr-" + UUID.randomUUID().toString().substring(0, 8));
            stub.setUsername(request.getEmail());
            stub.setEmail(request.getEmail());
            stub.setFirstName("Invited");
            stub.setLastName("User");
            stub.setStatus(UserStatus.INVITED);
            stub.setCreatedAt(Instant.now());
            stub.setUpdatedAt(Instant.now());
            userRepository.save(stub);
        }

        // Determine base URL dynamically (live tunnel / domain or localhost fallback)
        String baseUrl = "http://localhost:3000";
        if (request.getBaseUrl() != null && !request.getBaseUrl().isBlank()) {
            baseUrl = request.getBaseUrl().trim().replaceAll("/+$", "");
        } else if (defaultFrontendUrl != null && !defaultFrontendUrl.isBlank()) {
            baseUrl = defaultFrontendUrl.trim().replaceAll("/+$", "");
        }

        String encodedEmail = java.net.URLEncoder.encode(request.getEmail(), java.nio.charset.StandardCharsets.UTF_8);
        String invitationUrl = baseUrl + "/register?token=" + invitationToken + "&email=" + encodedEmail;
        boolean emailSent = emailService.sendInvitationEmail(request.getEmail(), request.getRole(), invitationUrl);

        Map<String, Object> response = new HashMap<>();
        response.put("invitationId", invitationId);
        response.put("email", request.getEmail());
        response.put("role", request.getRole());
        response.put("invitationUrl", invitationUrl);
        response.put("status", "INVITATION_EMAIL_SENT");
        response.put("emailDelivered", emailSent);
        response.put("deliveryChannel", emailSent ? "GMAIL_SMTP" : "LOCAL_SIMULATION");
        response.put("expiresAt", Instant.now().plusSeconds(86400 * 3).toString()); // 3 days validity

        log.info("[LegacyInvitationService] Invitation {} generated (emailDelivered={})", invitationId, emailSent);
        return response;
    }
}
