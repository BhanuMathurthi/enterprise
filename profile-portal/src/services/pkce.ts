/**
 * RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients (PKCE)
 * Provides cryptographically secure code_verifier and code_challenge (S256)
 * generation using the standard Web Crypto API.
 */

export interface PkcePair {
  verifier: string;
  challenge: string;
  method: 'S256';
  state: string;
}

/**
 * Encodes an ArrayBuffer to a URL-safe base64 string (RFC 7636 compliant).
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates a cryptographically random high-entropy string for code_verifier.
 */
export function generateRandomString(length: number = 64): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

/**
 * Computes SHA-256 hash of the verifier and returns the base64url-encoded challenge.
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(hash);
}

/**
 * Generates a full PKCE authorization parameter bundle.
 */
export async function createPkceChallenge(): Promise<PkcePair> {
  const verifier = generateRandomString(64);
  const challenge = await generateCodeChallenge(verifier);
  const state = generateRandomString(32);

  return {
    verifier,
    challenge,
    method: 'S256',
    state,
  };
}
