package com.enterprise.usermanagement.model;

/**
 * User account status across internal systems and Identity Provider.
 */
public enum UserStatus {
    ACTIVE,
    PENDING_ACTIVATION,
    SUSPENDED,
    INVITED
}
