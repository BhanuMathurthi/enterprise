export interface AuthUser {
  id: string;
  sub: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  expiresAt: number | null;
}
