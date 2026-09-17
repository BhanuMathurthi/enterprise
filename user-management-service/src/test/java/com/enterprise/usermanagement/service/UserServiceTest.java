package com.enterprise.usermanagement.service;

import com.enterprise.usermanagement.dto.request.AddressDto;
import com.enterprise.usermanagement.dto.request.CreateUserRequest;
import com.enterprise.usermanagement.dto.request.CustomAttributesDto;
import com.enterprise.usermanagement.dto.request.UpdateProfileRequest;
import com.enterprise.usermanagement.dto.response.IdentityUserResponse;
import com.enterprise.usermanagement.dto.response.UserProfileResponse;
import com.enterprise.usermanagement.identity.IdentityProviderClient;
import com.enterprise.usermanagement.identity.IdentityProviderFactory;
import com.enterprise.usermanagement.model.UserEntity;
import com.enterprise.usermanagement.model.UserStatus;
import com.enterprise.usermanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private IdentityProviderFactory identityProviderFactory;

    @Mock
    private IdentityProviderClient idpClient;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testCreateUser_DirectProvisioningFlow() {
        when(identityProviderFactory.getProvider()).thenReturn(idpClient);
        when(idpClient.provisionUser(any())).thenAnswer(inv ->
                new IdentityUserResponse("00u_test123", "PENDING_ACTIVATION", "jdoe@enterprise.com", "jdoe")
        );
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.save(any(UserEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateUserRequest req = new CreateUserRequest();
        req.setUsername("jdoe");
        req.setEmail("jdoe@enterprise.com");
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setDateOfBirth("1990-01-01");
        req.setPhoneNumber("+1 555-010-9988");
        req.setAddress(new AddressDto("123 Main St", "Metropolis", "NY", "10001", "US"));
        req.setCustomAttributes(new CustomAttributesDto("Engineering", "EMP-100", "en", true));

        UserProfileResponse res = userService.createUser(req);

        assertNotNull(res);
        assertNotNull(res.getId());
        assertEquals("00u_test123", res.getExternalIdentityId());
        assertEquals(UserStatus.PENDING_ACTIVATION, res.getStatus());
        assertEquals("John", res.getFirstName());
    }

    @Test
    void testCreateUser_RedeemPendingInvitation() {
        UserEntity invitedStub = new UserEntity();
        invitedStub.setId("usr-stub-999");
        invitedStub.setEmail("invited@enterprise.com");
        invitedStub.setUsername("invited@enterprise.com");
        invitedStub.setStatus(UserStatus.INVITED);

        when(identityProviderFactory.getProvider()).thenReturn(idpClient);
        when(idpClient.provisionUser(any())).thenAnswer(inv ->
                new IdentityUserResponse("00u_invited_redeemed", "PENDING_ACTIVATION", "invited@enterprise.com", "newusername")
        );
        when(userRepository.findByEmail("invited@enterprise.com")).thenReturn(Optional.of(invitedStub));
        when(userRepository.save(any(UserEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateUserRequest req = new CreateUserRequest();
        req.setUsername("newusername");
        req.setEmail("invited@enterprise.com");
        req.setFirstName("Jane");
        req.setLastName("Smith");
        req.setDateOfBirth("1995-05-15");
        req.setPhoneNumber("+1 555-777-1234");
        req.setAddress(new AddressDto("456 Elm St", "Boston", "MA", "02108", "US"));

        UserProfileResponse res = userService.createUser(req);

        assertNotNull(res);
        assertEquals("usr-stub-999", res.getId());
        assertEquals("00u_invited_redeemed", res.getExternalIdentityId());
        assertEquals(UserStatus.PENDING_ACTIVATION, res.getStatus());
        assertEquals("Jane", res.getFirstName());
    }

    @Test
    void testUpdateProfile_SynchronizesWithIdP() {
        UserEntity existing = new UserEntity();
        existing.setId("usr-test-1");
        existing.setExternalIdentityId("00u_existing");
        existing.setUsername("initial.user@enterprise.com");
        existing.setEmail("initial.user@enterprise.com");
        existing.setFirstName("Initial");
        existing.setLastName("User");
        existing.setStatus(UserStatus.ACTIVE);

        when(userRepository.findById("usr-test-1")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(UserEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(identityProviderFactory.getProvider()).thenReturn(idpClient);

        UpdateProfileRequest updateReq = new UpdateProfileRequest();
        updateReq.setFirstName("UpdatedFirst");
        updateReq.setLastName("UpdatedLast");
        updateReq.setDateOfBirth("1994-08-20");
        updateReq.setPhoneNumber("+1 555-999-8888");
        updateReq.setAddress(new AddressDto("200 New St", "San Francisco", "CA", "94105", "US"));

        UserProfileResponse updated = userService.updateProfile("usr-test-1", updateReq);

        assertEquals("UpdatedFirst", updated.getFirstName());
        assertEquals("UpdatedLast", updated.getLastName());
        assertEquals("+1 555-999-8888", updated.getPhoneNumber());
    }
}
