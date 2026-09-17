package com.enterprise.usermanagement.dto.request;

public class CustomAttributesDto {

    private String department;
    private String employeeId;
    private String preferredLanguage;
    private Boolean newsletterOptIn;

    public CustomAttributesDto() {
    }

    public CustomAttributesDto(String department, String employeeId, String preferredLanguage, Boolean newsletterOptIn) {
        this.department = department;
        this.employeeId = employeeId;
        this.preferredLanguage = preferredLanguage;
        this.newsletterOptIn = newsletterOptIn;
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
}
