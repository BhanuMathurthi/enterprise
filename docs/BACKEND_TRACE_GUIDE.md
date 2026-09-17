# Backend Onboarding & Trace Guide: Spring Boot User Management

This guide walks through the Spring Boot backend architecture, tracing how requests flow from the REST Controller through the Service Layer and Adapter Layer to downstream Identity Platforms.

---

## 1. Backend Layer Hierarchy

```
[1] UserProfileController (v2) (/api/v2/users)
      │
      ▼
[2] UserServiceImpl (Transactional Business Logic)
      │
      ├───────────────────────────────┐
      ▼                               ▼
[3] UserRepository (JPA / Local DB)  [4] IdentityProviderFactory (Strategy Selector)
                                              │
                                              ├───────────────────────────────┐
                                              ▼                               ▼
                     [5] NewIdentityPlatformClient      [6] LegacyIdentityProviderClient
                                    │                                 │
                                    ▼                                 ▼
                     Downstream 3rd-Party IdP REST API    Legacy IdP Internal API
```

---

## 2. Step-by-Step Code Walkthrough: User Creation Flow

### Step 1: Controller Layer
**File:** [UserProfileController.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/controller/v2/UserProfileController.java)
- Exposes `POST /api/v2/users`.
- Accepts `@Valid @RequestBody CreateUserRequest request`.
- If validation fails (e.g. invalid date of birth format or missing email), [GlobalExceptionHandler.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/exception/GlobalExceptionHandler.java) intercepts `MethodArgumentNotValidException` and returns HTTP 400 with an array of field-level errors.
- On success, delegates immediately to `userService.createUser(request)` and wraps the returned `UserProfileResponse` in `ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(...))`.

### Step 2: Service Layer & Business Validation
**File:** [UserServiceImpl.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/service/UserServiceImpl.java)
- Checks business constraints:
  ```java
  if (userRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("A user with email '" + request.getEmail() + "' already exists.");
  }
  ```
- Obtains the configured identity provider client via the factory:
  ```java
  IdentityProviderClient idpClient = identityProviderFactory.getProvider();
  IdentityUserResponse idpResponse = idpClient.provisionUser(request);
  ```
- Creates and persists a new `UserEntity`:
  - Assigns an internal ID `usr-{uuid}`.
  - Links the external identity ID (`idpResponse.getExternalId()`).
  - Sets account status to `PENDING_ACTIVATION` (ready for first-login factor configuration).
  - Populates structured address and custom enterprise attributes (department, employee ID).
- Persists via [UserRepository.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/repository/UserRepository.java) and returns a mapped `UserProfileResponse`.

### Step 3: Identity Adapter & Strategy Pattern
**File:** [IdentityProviderFactory.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/identity/IdentityProviderFactory.java)
- Reads configuration `identity.provider.active` from `application.yml` (defaults to `NEW`).
- Returns either:
  - `NewIdentityPlatformClient` (Third-Party Identity REST APIs)
  - `LegacyIdentityProviderClient` (Legacy Identity Provider)
- Enables switching providers with zero changes to business services or controllers.

### Step 4: Downstream Identity REST Integration
**File:** [NewIdentityPlatformClient.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/identity/NewIdentityPlatformClient.java)
- Constructs the HTTP request to the third-party Identity Platform:
  - Header: `Authorization: SSWS {admin_token}` or Bearer token.
  - Query parameter: `?activate=false` (keeps user in staged/pending activation).
  - Body: JSON user profile with mapped attributes.
- Calls `POST /v1/users` via `RestTemplate`.
- Parses the upstream JSON response into normalized `IdentityUserResponse`.

---

## 3. Backward Compatibility: Legacy Invitation Flow

**File:** [LegacyUserController.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/controller/v1/LegacyUserController.java) & [LegacyInvitationService.java](file:///Users/bhanu/Documents/ep/user-management-service/src/main/java/com/enterprise/usermanagement/service/LegacyInvitationService.java)
- Exposes `POST /api/v1/users/invite`.
- Generates a secure random invitation token stored in the database.
- Marks the stub user status as `INVITED`.
- Allows existing enterprise portals to continue functioning undisturbed while migrating to the new direct-provisioning flow.
