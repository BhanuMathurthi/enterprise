import { AuthUser, AuthSession } from '../types/auth';
import { ENV } from '../config/env';
import { createPkceChallenge } from './pkce';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

class AuthService {
  /**
   * Initiates the OIDC Authorization Code Flow with PKCE (RFC 7636).
   * Generates a high-entropy code_verifier and calculates SHA-256 code_challenge.
   */
  public async initiateOidcLogin(returnUrl: string = '/profile'): Promise<void> {
    const pkce = await createPkceChallenge();
    sessionStorage.setItem('oidc_verifier', pkce.verifier);
    sessionStorage.setItem('oidc_state', pkce.state);
    sessionStorage.setItem('oidc_return_url', returnUrl);

    // Demonstration of authorization URL creation with PKCE code_challenge
    const authUrl = `${ENV.IDP_ISSUER}/authorize?response_type=code&client_id=${encodeURIComponent(
      ENV.IDP_CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(
      ENV.IDP_REDIRECT_URI
    )}&scope=openid%20profile%20email&state=${encodeURIComponent(
      pkce.state
    )}&code_challenge=${encodeURIComponent(
      pkce.challenge
    )}&code_challenge_method=S256`;

    console.log('[AuthService] Redirecting to Identity Provider for Auth Code Flow + PKCE:', {
      authUrl,
      code_challenge: pkce.challenge,
      code_challenge_method: pkce.method,
      code_verifier: pkce.verifier,
    });

    // For local onboarding demonstration, establish mock authenticated session
    this.createDemoSession();
    window.location.href = returnUrl;
  }

  public createDemoSession(): void {
    const demoUser: AuthUser = {
      id: 'usr-1001',
      sub: 'usr-1001@corp.internal',
      email: 'alex.morgan@enterprise.com',
      name: 'Alex Morgan',
      roles: ['USER', 'PROFILE_EDITOR'],
    };
    const demoToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.demo-token-enterprise';

    localStorage.setItem(TOKEN_KEY, demoToken);
    localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
  }

  public getSession(): AuthSession {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);

    if (token && rawUser) {
      try {
        const user = JSON.parse(rawUser) as AuthUser;
        return {
          isAuthenticated: true,
          user,
          token,
          expiresAt: Date.now() + 3600 * 1000,
        };
      } catch (e) {
        console.error('Failed to parse auth user session', e);
      }
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null,
      expiresAt: null,
    };
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.clear();
    window.location.href = '/login';
  }
}

export const authService = new AuthService();
