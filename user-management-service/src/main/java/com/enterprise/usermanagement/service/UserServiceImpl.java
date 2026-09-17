package com.enterprise.usermanagement.service;

import com.enterprise.usermanagement.dto.request.AddressDto;
import com.enterprise.usermanagement.dto.request.CreateUserRequest;
import com.enterprise.usermanagement.dto.request.CustomAttributesDto;
import com.enterprise.usermanagement.dto.request.UpdateProfileRequest;
import com.enterprise.usermanagement.dto.response.IdentityUserResponse;
import com.enterprise.usermanagement.dto.response.UserProfileResponse;
import com.enterprise.usermanagement.exception.ResourceNotFoundException;
import com.enterprise.usermanagement.identity.IdentityProviderClient;
import com.enterprise.usermanagement.identity.IdentityProviderFactory;
import com.enterprise.usermanagement.model.UserEntity;
import com.enterprise.usermanagement.model.UserStatus;
import com.enterprise.usermanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of UserService.
 * 
 * Trace Path:
 * Controller -> UserService -> IdentityProviderFactory -> IdentityProviderClient (3rd Party IdP)
 */
@Service
@Transactional
public class UserServiceImpl implements UserService, CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final IdentityProviderFactory identityProviderFactory;

    public UserServiceImpl(UserRepository userRepository, IdentityProviderFactory identityProviderFactory) {
        this.userRepository = userRepository;
        this.identityProviderFactory = identityProviderFactory;
    }

    @Override
    public UserProfileResponse createUser(CreateUserRequest request) {
        log.info("[UserService] Creating user: username={}, email={}", request.getUsername(), request.getEmail());

        // Check local duplicate constraints or fulfill pending invitation
        Optional<UserEntity> existingOpt = userRepository.findByEmail(request.getEmail());
        UserEntity entity;
        if (existingOpt.isPresent()) {
            UserEntity existing = existingOpt.get();
            if (existing.getStatus() == UserStatus.INVITED) {
                log.info("[UserService] Redeeming pending invitation for email={}", request.getEmail());
                entity = existing;
            } else {
                throw new IllegalArgumentException("A user with email '" + request.getEmail() + "' already exists.");
            }
        } else {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("A user with username '" + request.getUsername() + "' already exists.");
            }
            entity = new UserEntity();
            entity.setId("usr-" + UUID.randomUUID().toString().substring(0, 8));
        }

        // 1. Provision user via Identity Provider Adapter
        IdentityProviderClient idpClient = identityProviderFactory.getProvider();
        IdentityUserResponse idpResponse = idpClient.provisionUser(request);

        // 2. Persist local entity mapped to Identity Provider subject ID
        entity.setExternalIdentityId(idpResponse.getExternalId());
        entity.setUsername(request.getUsername());
        entity.setEmail(request.getEmail());
        entity.setFirstName(request.getFirstName());
        entity.setLastName(request.getLastName());
        entity.setDateOfBirth(request.getDateOfBirth());
        entity.setPhoneNumber(request.getPhoneNumber());

        // New Identity Provider stages users in PENDING_ACTIVATION for first-login completion
        entity.setStatus(UserStatus.valueOf(idpResponse.getStatus()));

        if (request.getAddress() != null) {
            entity.setStreet(request.getAddress().getStreet());
            entity.setCity(request.getAddress().getCity());
            entity.setState(request.getAddress().getState());
            entity.setZipCode(request.getAddress().getZipCode());
            entity.setCountry(request.getAddress().getCountry());
        }

        if (request.getCustomAttributes() != null) {
            entity.setDepartment(request.getCustomAttributes().getDepartment());
            entity.setEmployeeId(request.getCustomAttributes().getEmployeeId());
            entity.setPreferredLanguage(request.getCustomAttributes().getPreferredLanguage());
            entity.setNewsletterOptIn(request.getCustomAttributes().getNewsletterOptIn());
        }

        UserEntity saved = userRepository.save(entity);
        log.info("[UserService] Successfully created user entity id={}, externalId={}", saved.getId(), saved.getExternalIdentityId());

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserById(String id) {
        log.info("[UserService] Fetching user by id={}", id);
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile with ID '" + id + "' was not found."));
        return mapToResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserByEmail(String email) {
        UserEntity entity = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile with email '" + email + "' was not found."));
        return mapToResponse(entity);
    }

    @Override
    public UserProfileResponse updateProfile(String id, UpdateProfileRequest request) {
        log.info("[UserService] Updating profile for user id={}", id);
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile with ID '" + id + "' was not found."));

        entity.setFirstName(request.getFirstName());
        entity.setLastName(request.getLastName());
        entity.setDateOfBirth(request.getDateOfBirth());
        entity.setPhoneNumber(request.getPhoneNumber());

        if (request.getAddress() != null) {
            entity.setStreet(request.getAddress().getStreet());
            entity.setCity(request.getAddress().getCity());
            entity.setState(request.getAddress().getState());
            entity.setZipCode(request.getAddress().getZipCode());
            entity.setCountry(request.getAddress().getCountry());
        }

        if (request.getCustomAttributes() != null) {
            entity.setDepartment(request.getCustomAttributes().getDepartment());
            entity.setEmployeeId(request.getCustomAttributes().getEmployeeId());
            entity.setPreferredLanguage(request.getCustomAttributes().getPreferredLanguage());
            entity.setNewsletterOptIn(request.getCustomAttributes().getNewsletterOptIn());
        }

        // Synchronize changes with downstream identity provider if external ID is present
        if (entity.getExternalIdentityId() != null) {
            IdentityProviderClient idpClient = identityProviderFactory.getProvider();
            idpClient.updateUser(entity.getExternalIdentityId(), request);
        }

        UserEntity updated = userRepository.save(entity);
        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserProfileResponse mapToResponse(UserEntity entity) {
        UserProfileResponse res = new UserProfileResponse();
        res.setId(entity.getId());
        res.setExternalIdentityId(entity.getExternalIdentityId());
        res.setUsername(entity.getUsername());
        res.setEmail(entity.getEmail());
        res.setFirstName(entity.getFirstName());
        res.setLastName(entity.getLastName());
        res.setDateOfBirth(entity.getDateOfBirth());
        res.setPhoneNumber(entity.getPhoneNumber());
        res.setStatus(entity.getStatus());

        AddressDto address = new AddressDto(
                entity.getStreet(),
                entity.getCity(),
                entity.getState(),
                entity.getZipCode(),
                entity.getCountry()
        );
        res.setAddress(address);

        CustomAttributesDto customAttrs = new CustomAttributesDto(
                entity.getDepartment(),
                entity.getEmployeeId(),
                entity.getPreferredLanguage(),
                entity.getNewsletterOptIn()
        );
        res.setCustomAttributes(customAttrs);

        res.setCreatedAt(entity.getCreatedAt());
        res.setUpdatedAt(entity.getUpdatedAt());
        return res;
    }

    /**
     * Seeds initial enterprise mock users (Active, Pending Activation, Suspended, Legacy)
     * so local development, tests, and PostgreSQL databases have instant realistic data!
     */
    @Override
    public void run(String... args) {
        seedUser("usr-1001", "00u1abcd234EFGH567", "alex.morgan@enterprise.com", "alex.morgan@enterprise.com",
                "Alex", "Morgan", "1992-05-14", "+1 (555) 019-2834", UserStatus.ACTIVE,
                "100 Enterprise Way, Suite 400", "San Francisco", "CA", "94105", "US",
                "Security & Identity", "EMP-90210", "en", true);

        seedUser("usr-1002", "00u2bcde345FGHI678", "sarah.connor@enterprise.com", "sarah.connor@enterprise.com",
                "Sarah", "Connor", "1988-11-23", "+1 (555) 028-4921", UserStatus.ACTIVE,
                "450 Tech Ridge Blvd", "Austin", "TX", "78753", "US",
                "DevOps & Cloud", "EMP-84721", "en", true);

        seedUser("usr-1003", "00u3cdef456GHIJ789", "marcus.chen@enterprise.com", "marcus.chen@enterprise.com",
                "Marcus", "Chen", "1995-03-08", "+1 (555) 037-8812", UserStatus.PENDING_ACTIVATION,
                "120 Wall Street, Floor 18", "New York", "NY", "10005", "US",
                "Financial Technology", "EMP-71932", "en", false);

        seedUser("usr-1004", "00u4defg567HIJK890", "elena.rostova@enterprise.com", "elena.rostova@enterprise.com",
                "Elena", "Rostova", "1990-09-17", "+1 (555) 046-1190", UserStatus.ACTIVE,
                "800 Bellevue Way NE", "Seattle", "WA", "98004", "US",
                "AI / Machine Learning", "EMP-62914", "en", true);

        seedUser("usr-1005", "00u5efgh678IJKL901", "david.kim@enterprise.com", "david.kim@enterprise.com",
                "David", "Kim", "1985-07-30", "+1 (555) 055-6734", UserStatus.SUSPENDED,
                "233 S Wacker Dr", "Chicago", "IL", "60606", "US",
                "HR Operations", "EMP-51092", "en", false);

        seedUser("usr-1006", "00u6fghi789JKLM012", "priya.patel@enterprise.com", "priya.patel@enterprise.com",
                "Priya", "Patel", "1993-12-05", "+44 20 7946 0912", UserStatus.PENDING_ACTIVATION,
                "25 Bank Street, Canary Wharf", "London", "Greater London", "E14 5JP", "GB",
                "Enterprise Architecture", "EMP-43891", "en", true);

        seedUser("usr-1007", "LEGACY_USER_7788", "james.wilson@enterprise.com", "james.wilson@enterprise.com",
                "James", "Wilson", "1982-01-19", "+1 (555) 064-9022", UserStatus.ACTIVE,
                "161 Bay Street, Suite 2700", "Toronto", "ON", "M5J 2S1", "CA",
                "Legal & Compliance", "EMP-30419", "en", false);
    }

    private void seedUser(String id, String extId, String username, String email,
                           String firstName, String lastName, String dob, String phone,
                           UserStatus status, String street, String city, String state,
                           String zip, String country, String dept, String empId,
                           String lang, boolean optIn) {
        if (!userRepository.existsById(id)) {
            log.info("[UserService] Initializing mock profile {} ({}) for onboarding", id, email);
            UserEntity user = new UserEntity();
            user.setId(id);
            user.setExternalIdentityId(extId);
            user.setUsername(username);
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setDateOfBirth(dob);
            user.setPhoneNumber(phone);
            user.setStatus(status);
            user.setStreet(street);
            user.setCity(city);
            user.setState(state);
            user.setZipCode(zip);
            user.setCountry(country);
            user.setDepartment(dept);
            user.setEmployeeId(empId);
            user.setPreferredLanguage(lang);
            user.setNewsletterOptIn(optIn);
            userRepository.save(user);
        }
    }
}
