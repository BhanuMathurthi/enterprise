import { ENV } from '../config/env';
import { ApiErrorResponse } from '../types/api';

export class ApiError extends Error {
  status: number;
  data?: ApiErrorResponse;

  constructor(status: number, message: string, data?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || 'demo-bearer-token-oidc';
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const mergedHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    const maxRetries = (restOptions.method === 'GET' || !restOptions.method) ? 2 : 0;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(url, {
          ...restOptions,
          headers: mergedHeaders,
        });

        // Handle 204 No Content
        if (response.status === 204) {
          return {} as T;
        }

        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
          // If server is returning 502/503/504 and we have retries left, wait and retry
          if ([502, 503, 504].includes(response.status) && attempt < maxRetries) {
            attempt++;
            await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
            continue;
          }

          const errorData = isJson ? (data as ApiErrorResponse) : undefined;
          let errorMessage: string;

          if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (typeof data === 'string' && data) {
            if (data.includes('<html') || data.includes('<!DOCTYPE') || data.includes('<body')) {
              if (response.status === 502) {
                errorMessage = 'Backend service is waking up (502 Bad Gateway). Please refresh in a moment.';
              } else if (response.status === 504) {
                errorMessage = 'Gateway timeout (504). The server is taking longer than expected to start.';
              } else if (response.status === 503) {
                errorMessage = 'Service temporarily unavailable (503). Please retry shortly.';
              } else {
                errorMessage = `Server error (HTTP ${response.status}). Please refresh the page.`;
              }
            } else {
              errorMessage = data.trim();
            }
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText || 'Server Error'}`;
          }

          throw new ApiError(response.status, errorMessage, errorData);
        }

        return data as T;
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          throw error;
        }
        if (attempt < maxRetries) {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
          continue;
        }
        const networkError = error as Error;
        throw new ApiError(0, networkError.message || 'Network request failed. Please check backend connectivity.');
      }
    }

    throw new ApiError(500, 'Request failed after multiple attempts.');
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(ENV.API_BASE_URL);
