/**
 * Centralized Environment Configuration
 * In enterprise applications, environment variables configure API gateways,
 * Identity Provider OIDC metadata, and logging levels across dev/stage/prod.
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  IDP_ISSUER: import.meta.env.VITE_IDP_ISSUER || 'https://identity.enterprise.internal/oauth2/default',
  IDP_CLIENT_ID: import.meta.env.VITE_IDP_CLIENT_ID || 'enterprise-profile-portal-client',
  IDP_REDIRECT_URI: import.meta.env.VITE_IDP_REDIRECT_URI || 'http://localhost:3000/login/callback',
  APP_ENV: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
};
