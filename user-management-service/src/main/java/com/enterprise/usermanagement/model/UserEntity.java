package com.enterprise.usermanagement.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "enterprise_users")
public class UserEntity {

    @Id
    @Column(nullable = false, unique = true, length = 64)
    private String id;

    @Column(name = "external_identity_id", unique = true, length = 128)
    private String externalIdentityId;

    @Column(nullable = false, unique = true, length = 128)
    private String username;

    @Column(nullable = false, unique = true, length = 256)
    private String email;

    @Column(name = "first_name", nullable = false, length = 128)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 128)
    private String lastName;

    @Column(name = "date_of_birth", length = 32)
    private String dateOfBirth;

    @Column(name = "phone_number", length = 64)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private UserStatus status;

    // Structured Address Fields
    @Column(length = 256)
    private String street;

    @Column(length = 128)
    private String city;

    @Column(length = 64)
    private String state;

    @Column(name = "zip_code", length = 32)
    private String zipCode;

    @Column(length = 64)
    private String country;

    // Custom Profile Attributes
    @Column(length = 128)
    private String department;

    @Column(name = "employee_id", length = 64)
    private String employeeId;

    @Column(name = "preferred_language", length = 16)
    private String preferredLanguage;

    @Column(name = "newsletter_opt_in")
    private Boolean newsletterOptIn;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public UserEntity() {
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
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

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public Boolean getNewsletterOptIn() {
        return newsletterOptIn;
    }

    public void setNewsletterOptIn(Boolean newsletterOptIn) {
        this.newsletterOptIn = newsletterOptIn;
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
