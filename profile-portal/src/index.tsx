import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

/**
 * Enterprise Profile Portal - Application Entry Point
 * 
 * Trace Path:
 * 1. index.tsx (Mounts React to DOM root)
 * 2. App.tsx (Root component: AuthProvider, Router, Global Layout)
 * 3. routes/AppRoutes.tsx (Resolves active route: /profile, /register, etc.)
 * 4. pages/ManageProfile/ManageProfilePage.tsx (Active page component)
 * 5. components/profile/ProfileForm.tsx (UI controls and validation)
 * 6. services/userService.ts (Domain API service)
 * 7. services/apiClient.ts (HTTP client & Bearer token attachment)
 * 8. REST Call to Spring Boot Backend (/api/v2/users)
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root DOM element "#root" was not found in index.html');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
