# Enterprise Identity Provider Migration Project

A reference architecture and runnable enterprise codebase demonstrating the migration from an existing legacy Identity Provider to a new third-party Identity Platform (e.g. Okta, Auth0, Keycloak, Ping Identity).

This repository contains two coordinated enterprise applications:
1. **[React Profile Portal](file:///Users/bhanu/Documents/ep/profile-portal)** (Greenfield Frontend): Custom UI for Registration / Profile Setup and Manage Profile, built with React, TypeScript, and Bootstrap 5.
2. **[Spring Boot User Management Service](file:///Users/bhanu/Documents/ep/user-management-service)** (Backend Integration Layer): Enhanced backend implementing the Adapter/Strategy Pattern to support both the **legacy invitation flow (v1)** and the **new direct provisioning & first-login activation flow (v2)**.

---

## Architecture & Data Flow

```
React Profile Portal (Port 3000)
    │
    ▼ (REST / JSON with Bearer Token)
Spring Boot User Management Service (Port 8080)
    │
    ├──────────────────────────────┐
    ▼                              ▼
PostgreSQL Relational Database    IdentityProviderFactory (Strategy Pattern)
                                   │
                                   ├──────────────────────────────┐
                                   ▼                              ▼
                      NewIdentityPlatformClient      LegacyIdentityProviderClient
                                   │                              │
                                   ▼                              ▼
                      Third-Party Identity REST API     Legacy IdP Endpoints
```

---

## Project Structure

```
/Users/bhanu/Documents/ep/
├── profile-portal/                 # React 18 + TypeScript + Vite + Bootstrap 5 Frontend
│   ├── src/
│   │   ├── index.tsx               # [1] Application Entry Point
│   │   ├── App.tsx                 # [2] Root React Component & Providers
│   │   ├── routes/                 # [3] AppRoutes.tsx & ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Registration/       # Initial Profile Setup (Validation, no password in React)
│   │   │   ├── ManageProfile/      # View & Edit Profile (DOB, Address, Dept, Custom attributes)
│   │   │   ├── LegacyDemo/         # Sandbox testing backward-compatible v1 invitation API
│   │   │   └── Login/              # OIDC / SSO Callback landing
│   │   ├── components/             # Reusable UI Controls (DatePickerField, FormField, etc.)
│   │   ├── services/               # [4] userService.ts & apiClient.ts (HTTP + Auth Interceptor)
│   │   ├── context/                # [5] AuthContext.tsx (Session state & OIDC helpers)
│   │   ├── config/                 # [6] env.ts (Typed environment variables)
│   │   └── styles/                 # Design system tokens & Bootstrap overrides
│   ├── package.json
│   └── Dockerfile                  # Multi-stage Nginx container
│
├── user-management-service/        # Spring Boot 3.2 + Java 17 Backend
│   ├── src/main/java/com/enterprise/usermanagement/
│   │   ├── controller/
│   │   │   ├── v1/LegacyUserController.java     # Backward-compatible invitation API (/api/v1)
│   │   │   ├── v2/UserProfileController.java    # Greenfield Profile REST API (/api/v2)
│   │   │   └── mock/MockIdpController.java      # Embedded mock for 3rd-party IdP REST APIs
│   │   ├── service/
│   │   │   ├── UserService.java & UserServiceImpl.java
│   │   │   └── LegacyInvitationService.java
│   │   ├── identity/
│   │   │   ├── IdentityProviderClient.java      # Unified Adapter Interface
│   │   │   ├── NewIdentityPlatformClient.java   # Integration with 3rd-party IdP APIs
│   │   │   ├── LegacyIdentityProviderClient.java# Integration with legacy IdP
│   │   │   └── IdentityProviderFactory.java     # Adapter / Strategy Selector
│   │   ├── model/                  # UserEntity.java, UserStatus.java
│   │   ├── repository/             # UserRepository.java
│   │   ├── dto/                    # Request & Response DTOs with validation annotations
│   │   └── exception/              # GlobalExceptionHandler.java (RFC 7807 problem details)
│   ├── pom.xml
│   ├── mvnw & .mvn/wrapper/        # Maven wrapper for zero-config build
│   └── Dockerfile                  # Multi-stage JRE container
│
├── .github/workflows/
│   └── ci-cd.yml                   # Automated CI/CD Pipeline (Build, Test, Scan, K8s Deploy)
│
├── k8s/                            # Production Kubernetes Manifests (Kustomize)
│   ├── namespace.yaml              # Enforces restricted Pod Security Standards
│   ├── configmap.yaml & secret.yaml# Externalized IdP configurations and secrets
│   ├── backend-deployment.yaml     # Spring Boot Deployment (HPA, PDB, Probes, Service)
│   ├── frontend-deployment.yaml    # React Nginx Deployment (HPA, PDB, Probes, Service)
│   ├── ingress.yaml                # Ingress Controller with TLS Termination
│   └── network-policy.yaml         # Zero-Trust network isolation rules
│
├── scripts/init-db/                # PostgreSQL Initialization & Mock Data Scripts
│   ├── 01-schema.sql               # DDL for enterprise_users table and indexes
│   └── 02-seed-data.sql            # Rich mock enterprise user dataset
│
├── docs/                           # Comprehensive Onboarding Documentation
│   ├── ARCHITECTURE.md             # Complete system topology, security boundaries, OIDC PKCE
│   ├── FRONTEND_TRACE_GUIDE.md     # Detailed file-by-file walkthrough: Entry -> App -> Page -> Service
│   ├── BACKEND_TRACE_GUIDE.md      # Detailed file-by-file walkthrough: Controller -> Service -> IdP
│   ├── MIGRATION_STRATEGY.md       # Roadmap for v1 vs v2 coexistence & phased rollout
│   ├── DEPLOYMENT_AND_CICD_GUIDE.md# End-to-end CI/CD and Kubernetes operational guide
│   └── DATABASE_MANAGEMENT_GUIDE.md# PostgreSQL connection, mock data, and management runbook
├── docker-compose.yml              # Multi-container deployment (Postgres, Adminer, Backend, Frontend)
└── README.md                       # This file
```

---

## Onboarding Quickstart Guides

### 1. Tracing the Codebase for New Developers
If you are onboarding and want to understand how a normal page works end-to-end:
- 📖 Read **[docs/FRONTEND_TRACE_GUIDE.md](file:///Users/bhanu/Documents/ep/docs/FRONTEND_TRACE_GUIDE.md)** for a clear walkthrough:
  `index.tsx` $\rightarrow$ `App.tsx` $\rightarrow$ `AppRoutes.tsx` $\rightarrow$ `ManageProfilePage.tsx` $\rightarrow$ `ProfileForm.tsx` $\rightarrow$ `userService.ts` $\rightarrow$ `apiClient.ts` $\rightarrow$ Backend.
- 📖 Read **[docs/BACKEND_TRACE_GUIDE.md](file:///Users/bhanu/Documents/ep/docs/BACKEND_TRACE_GUIDE.md)** for:
  `UserProfileController` (v2) $\rightarrow$ `UserServiceImpl` $\rightarrow$ `IdentityProviderFactory` $\rightarrow$ `NewIdentityPlatformClient` $\rightarrow$ External Identity REST API.
- 📖 Read **[docs/MIGRATION_STRATEGY.md](file:///Users/bhanu/Documents/ep/docs/MIGRATION_STRATEGY.md)** for the strategy on backward compatibility and the difference between the invitation flow and the direct-provisioning first-login activation flow.
- 📖 Read **[docs/DEPLOYMENT_AND_CICD_GUIDE.md](file:///Users/bhanu/Documents/ep/docs/DEPLOYMENT_AND_CICD_GUIDE.md)** for the CI/CD pipeline, Trivy container security scans, and zero-downtime Kubernetes deployments.
- 📖 Read **[docs/DATABASE_MANAGEMENT_GUIDE.md](file:///Users/bhanu/Documents/ep/docs/DATABASE_MANAGEMENT_GUIDE.md)** for PostgreSQL configuration, pre-loaded mock personas, querying via `psql`, and Web GUI management.

---

## Running Locally

### Option A: Run Services Locally

#### 1. Start the Spring Boot Backend (Port 8080)
```bash
cd user-management-service
mvn spring-boot:run
# or using the wrapper:
./mvnw spring-boot:run
```
- API Base: `http://localhost:8080/api/v2/users`
- Database: Connects to PostgreSQL at `localhost:5432/usermanagement` (or managed via Adminer at `http://localhost:8081`)

#### 2. Start the React Profile Portal (Port 3000)
```bash
cd profile-portal
npm install
npm run dev
```
- Open your browser at `http://localhost:3000`.
- Includes live API proxying to `http://localhost:8080/api`.

### Option B: Run with PostgreSQL via Docker Compose
```bash
docker-compose up --build
```
- **React Profile Portal**: `http://localhost:3000`
- **Spring Boot Backend**: `http://localhost:8080`
- **PostgreSQL Database**: Port `5432` (`postgres/postgres`, db `usermanagement`)
- **Web Database Manager (Adminer)**: `http://localhost:8081` (instant browser-based table & data management)

To run backend locally with PostgreSQL:
```bash
cd user-management-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=postgres
```

---

## Automated Verification & Tests

### Backend Unit & Integration Tests
```bash
cd user-management-service
mvn test
```
Verified test suite:
- `UserProfileControllerTest.testGetDemoUser_Success`: Verifies pre-seeded user retrieval.
- `UserProfileControllerTest.testCreateUser_ValidationFailure_MissingFields`: Verifies RFC 7807 validation error response.
- `UserProfileControllerTest.testLegacyInvitation_BackwardCompatibility`: Verifies `/api/v1/users/invite` backward compatibility.
- `UserServiceTest.testCreateUser_DirectProvisioningFlow`: Verifies user provisioning via Identity Provider Adapter.
- `UserServiceTest.testUpdateProfile_SynchronizesWithIdP`: Verifies profile attribute updates synced to downstream IdP.

### Frontend TypeScript Check & Production Build
```bash
cd profile-portal
npm run build
```
Builds bundle with 0 errors via Vite and TypeScript compiler (`tsc`).
