package com.enterprise.usermanagement.controller.v1;

import com.enterprise.usermanagement.dto.request.LegacyInvitationRequest;
import com.enterprise.usermanagement.dto.response.ApiResponse;
import com.enterprise.usermanagement.service.LegacyInvitationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST API v1: Backward-Compatible Legacy Endpoints.
 * 
 * Maintained for legacy client web portals that continue to use
 * invitation-token based registration while migration is phased.
 */
@RestController
@RequestMapping("/api/v1/users")
public class LegacyUserController {

    private static final Logger log = LoggerFactory.getLogger(LegacyUserController.class);

    private final LegacyInvitationService invitationService;

    public LegacyUserController(LegacyInvitationService invitationService) {
        this.invitationService = invitationService;
    }

    /**
     * Legacy invitation endpoint: generates an invitation link sent via email.
     */
    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendInvitation(
            @Valid @RequestBody LegacyInvitationRequest request) {
        log.info("[LegacyUserController v1] POST /api/v1/users/invite for email={}", request.getEmail());
        Map<String, Object> invitation = invitationService.createInvitation(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created(invitation, "Legacy invitation dispatched successfully."));
    }
}
