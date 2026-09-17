# Frontend Onboarding & Trace Guide: React Profile Portal

This guide provides a step-by-step code walkthrough of how an enterprise React page is structured and executed, tracing from the application entry point down to the backend REST call.

---

## 1. Trace Hierarchy Overview

```
[1] index.tsx (Mounts Application)
  └── [2] App.tsx (Root Component, AuthProvider, Global Layout)
        └── [3] routes/AppRoutes.tsx (Path Resolution)
              └── [4] routes/ProtectedRoute.tsx (Session Guard)
                    └── [5] pages/ManageProfile/ManageProfilePage.tsx (Page Orchestrator)
                          ├── [6] components/profile/ProfileForm.tsx (UI & Validation)
                          ├── [7] components/common/DatePickerField.tsx (Custom Control)
                          └── [8] services/userService.ts (Domain API Layer)
                                └── [9] services/apiClient.ts (HTTP Client & Auth Interceptor)
                                      └── [10] Backend REST API: PUT /api/v2/users/{id}
```

---

## 2. Step-by-Step Code Walkthrough

### Step 1: Application Entry Point
**File:** [index.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/index.tsx)
- Locates the root DOM element: `document.getElementById('root')`.
- Creates the React 18 root using `ReactDOM.createRoot`.
- Mounts the top-level `<App />` component inside `React.StrictMode`.

### Step 2: Root Component & Context Setup
**File:** [App.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/App.tsx)
- Sets up global providers:
  - `<BrowserRouter>` for HTML5 client-side routing.
  - `<AuthProvider>` (from [AuthContext.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/context/AuthContext.tsx)) to provide authentication state (`isAuthenticated`, `user`, `login`, `logout`) across all components.
- Injects global styles ([index.css](file:///Users/bhanu/Documents/ep/profile-portal/src/styles/index.css) and [bootstrap-custom.css](file:///Users/bhanu/Documents/ep/profile-portal/src/styles/bootstrap-custom.css)).
- Renders the shell layout: `<Navbar />`, `<main className="main-content"><AppRoutes /></main>`, and `<Footer />`.

### Step 3: Routing & Route Protection
**File:** [AppRoutes.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/routes/AppRoutes.tsx) & [ProtectedRoute.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/routes/ProtectedRoute.tsx)
- Resolves URL routes:
  - `/`: Redirects to `/profile`.
  - `/profile`: Protected route rendering `<ManageProfilePage />`.
  - `/register`: Public registration route rendering `<RegistrationPage />`.
  - `/legacy-demo`: Demonstrates legacy v1 invitation API coexistence.
  - `/login`: Single Sign-On and OIDC authorization trigger.
- In `ProtectedRoute.tsx`, if `isAuthenticated === false`, the router redirects the browser to `/login` preserving the target path in navigation state.

### Step 4: Page Orchestration
**File:** [ManageProfilePage.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/pages/ManageProfile/ManageProfilePage.tsx)
- Uses `useState` for `profile`, `loading`, `saving`, and `alert`.
- On mount, triggers `fetchProfile()` via `useEffect`:
  ```typescript
  const data = await userService.getProfile('usr-1001');
  setProfile(data);
  ```
- Renders the profile summary card and delegates form editing to `<ProfileForm />`.

### Step 5: Form Components & Rich Business Validation
**File:** [ProfileForm.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/components/profile/ProfileForm.tsx)
- Manages local form state (`UpdateProfileRequest`).
- Validates field constraints before sending to backend:
  - Name length & presence.
  - Corporate email format regex.
  - Custom phone validation.
  - Structured address fields (street, city, state dropdown, zip).
  - Enterprise custom attributes (Department, Employee ID).
- Embeds [DatePickerField.tsx](file:///Users/bhanu/Documents/ep/profile-portal/src/components/common/DatePickerField.tsx) for Date of Birth:
  - Enforces standard `YYYY-MM-DD` ISO formatting.
  - Calculates age boundaries: user must be at least 18 years of age.

### Step 6: Domain Service Layer
**File:** [userService.ts](file:///Users/bhanu/Documents/ep/profile-portal/src/services/userService.ts)
- Abstracted domain service decoupling React components from network mechanics:
  ```typescript
  public async updateProfile(userId: string, data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>(`/v2/users/${userId}`, data);
    return response.data;
  }
  ```

### Step 7: HTTP Client & Interceptors
**File:** [apiClient.ts](file:///Users/bhanu/Documents/ep/profile-portal/src/services/apiClient.ts)
- Uses native `fetch` with centralized base URL configuration from [env.ts](file:///Users/bhanu/Documents/ep/profile-portal/src/config/env.ts).
- Automatically injects the OIDC Bearer token:
  ```typescript
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  ```
- Translates non-2xx HTTP responses into typed `ApiError` instances with status codes, error messages, and server field errors.

---

## 3. Key React Architectural Concepts

| Concern | Implementation Location | Enterprise Pattern |
| :--- | :--- | :--- |
| **Session Management** | `context/AuthContext.tsx` | Context API + In-Memory Token with Storage fallback |
| **API Endpoints** | `config/env.ts` | Environment variables (`VITE_API_BASE_URL`) |
| **Error Handling** | `services/apiClient.ts` | Centralized typed `ApiError` class |
| **Form Validation** | `components/common/FormField.tsx` | Real-time feedback with invalid state styling |
| **Custom Controls** | `components/common/DatePickerField.tsx` | Encapsulated date formatting & age boundary checking |
