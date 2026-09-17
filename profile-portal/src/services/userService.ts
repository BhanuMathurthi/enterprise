import { apiClient } from './apiClient';
import { UserProfile, CreateUserRequest, UpdateProfileRequest } from '../types/user';
import { ApiResponse } from '../types/api';

class UserService {
  /**
   * Fetches the current user's profile from the backend.
   * Path: GET /api/v2/users/{userId}
   */
  public async getProfile(userId: string): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(`/v2/users/${userId}`);
    return response.data;
  }

  /**
   * Updates an existing user's profile attributes.
   * Path: PUT /api/v2/users/{userId}
   */
  public async updateProfile(userId: string, data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>(`/v2/users/${userId}`, data);
    return response.data;
  }

  /**
   * Creates a new user in the system & third-party identity platform.
   * Path: POST /api/v2/users
   * Notice: Identity Provider will create the user in PENDING_ACTIVATION state.
   */
  public async registerProfile(data: CreateUserRequest): Promise<UserProfile> {
    const response = await apiClient.post<ApiResponse<UserProfile>>('/v2/users', data);
    return response.data;
  }

  /**
   * Demonstrates the legacy invitation API for backward compatibility.
   * Path: POST /api/v1/users/invite
   */
  public async sendLegacyInvitation(
    email: string,
    role: string,
    baseUrl?: string
  ): Promise<{
    invitationId: string;
    status: string;
    invitationUrl?: string;
    emailDelivered?: boolean;
    deliveryChannel?: string;
  }> {
    const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : undefined);
    const response = await apiClient.post<
      ApiResponse<{
        invitationId: string;
        status: string;
        invitationUrl?: string;
        emailDelivered?: boolean;
        deliveryChannel?: string;
      }>
    >('/v1/users/invite', {
      email,
      role,
      baseUrl: origin,
    });
    return response.data;
  }

}

export const userService = new UserService();
