package com.enterprise.usermanagement.dto.response;

import com.enterprise.usermanagement.dto.request.AddressDto;
import com.enterprise.usermanagement.dto.request.CustomAttributesDto;
import com.enterprise.usermanagement.model.UserStatus;

import java.time.Instant;

public class UserProfileResponse {

    private String id;
    private String externalIdentityId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private String phoneNumber;
    private UserStatus status;
    private AddressDto address;
    private CustomAttributesDto customAttributes;
    private Instant createdAt;
    private Instant updatedAt;

    public UserProfileResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getExternalIdentityId() {
        return externalIdentityId;
    }

    public void setExternalIdentityId(String externalIdentityId) {
        this.externalIdentityId = externalIdentityId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public AddressDto getAddress() {
        return address;
    }

    public void setAddress(AddressDto address) {
        this.address = address;
    }

    public CustomAttributesDto getCustomAttributes() {
        return customAttributes;
    }

    public void setCustomAttributes(CustomAttributesDto customAttributes) {
        this.customAttributes = customAttributes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
