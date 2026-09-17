package com.enterprise.usermanagement.controller;

import com.enterprise.usermanagement.config.SecurityConfig;
import com.enterprise.usermanagement.controller.v1.LegacyUserController;
import com.enterprise.usermanagement.controller.v2.UserProfileController;
import com.enterprise.usermanagement.dto.response.UserProfileResponse;
import com.enterprise.usermanagement.exception.GlobalExceptionHandler;
import com.enterprise.usermanagement.model.UserStatus;
import com.enterprise.usermanagement.service.LegacyInvitationService;
import com.enterprise.usermanagement.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {UserProfileController.class, LegacyUserController.class})
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class UserProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private LegacyInvitationService legacyInvitationService;

    @Test
    void testGetDemoUser_Success() throws Exception {
        UserProfileResponse mockUser = new UserProfileResponse();
        mockUser.setId("usr-1001");
        mockUser.setEmail("alex.morgan@enterprise.com");
        mockUser.setStatus(UserStatus.ACTIVE);
        mockUser.setFirstName("Alex");
        mockUser.setLastName("Morgan");

        when(userService.getUserById("usr-1001")).thenReturn(mockUser);

        mockMvc.perform(get("/api/v2/users/usr-1001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("usr-1001"))
                .andExpect(jsonPath("$.data.email").value("alex.morgan@enterprise.com"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));
    }

    @Test
    void testCreateUser_ValidationFailure_MissingFields() throws Exception {
        // Empty payload should fail Jakarta Bean validation
        mockMvc.perform(post("/api/v2/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").isArray());
    }

    @Test
    void testLegacyInvitation_BackwardCompatibility() throws Exception {
        Map<String, Object> mockInvitation = Map.of(
                "invitationId", "inv-e6af4fd1",
                "email", "partner@enterprise.com",
                "status", "INVITATION_EMAIL_SENT",
                "invitationUrl", "https://legacy-idp.enterprise.internal/invite/confirm?token=inv-token-xyz"
        );

        when(legacyInvitationService.createInvitation(any())).thenReturn(mockInvitation);

        String legacyPayload = """
                {
                    "email": "partner@enterprise.com",
                    "role": "PORTAL_VIEWER",
                    "customNote": "Onboarding partner"
                }
                """;

        mockMvc.perform(post("/api/v1/users/invite")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(legacyPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.invitationId").value("inv-e6af4fd1"))
                .andExpect(jsonPath("$.data.status").value("INVITATION_EMAIL_SENT"));
    }
}
