export type UserStatus = 'ACTIVE' | 'PENDING_ACTIVATION' | 'SUSPENDED';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomAttributes {
  department?: string;
  employeeId?: string;
  preferredLanguage?: string;
  newsletterOptIn?: boolean;
}

export interface UserProfile {
  id: string;
  externalIdentityId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  phoneNumber: string;
  status: UserStatus;
  address: Address;
  customAttributes: CustomAttributes;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload sent during initial profile setup / registration.
 * Notice: Password & MFA are NEVER sent here. The identity provider handles them!
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: Address;
  customAttributes: CustomAttributes;
}

/**
 * Payload sent when updating profile details.
 */
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: Address;
  customAttributes: CustomAttributes;
}
