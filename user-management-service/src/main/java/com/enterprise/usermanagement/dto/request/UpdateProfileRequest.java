package com.enterprise.usermanagement.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 64, message = "First name must be between 2 and 64 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 64, message = "Last name must be between 2 and 64 characters")
    private String lastName;

    @NotBlank(message = "Date of birth is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date of birth must match format YYYY-MM-DD")
    private String dateOfBirth;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotNull(message = "Address details are required")
    @Valid
    private AddressDto address;

    @Valid
    private CustomAttributesDto customAttributes;

    public UpdateProfileRequest() {
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
}
