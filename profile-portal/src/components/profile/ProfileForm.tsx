import React, { useState } from 'react';
import { FormField } from '../common/FormField';
import { DatePickerField } from '../common/DatePickerField';
import { SelectDropdown } from '../common/SelectDropdown';
import { UserProfile, UpdateProfileRequest } from '../../types/user';

interface ProfileFormProps {
  initialData: UserProfile;
  onSubmit: (updatedData: UpdateProfileRequest) => Promise<void>;
  isLoading: boolean;
}

const US_STATES = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'WA', label: 'Washington' },
  { value: 'IL', label: 'Illinois' },
  { value: 'FL', label: 'Florida' },
  { value: 'MA', label: 'Massachusetts' },
];

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'IN', label: 'India' },
  { value: 'AU', label: 'Australia' },
];

const DEPARTMENTS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product Management', label: 'Product Management' },
  { value: 'Security & Identity', label: 'Security & Identity' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Finance', label: 'Finance' },
];

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    phoneNumber: initialData.phoneNumber || '',
    address: {
      street: initialData.address?.street || '',
      city: initialData.address?.city || '',
      state: initialData.address?.state || 'CA',
      zipCode: initialData.address?.zipCode || '',
      country: initialData.address?.country || 'US',
    },
    customAttributes: {
      department: initialData.customAttributes?.department || 'Engineering',
      employeeId: initialData.customAttributes?.employeeId || '',
      preferredLanguage: initialData.customAttributes?.preferredLanguage || 'en',
      newsletterOptIn: initialData.customAttributes?.newsletterOptIn ?? true,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dobValid, setDobValid] = useState(true);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errs.firstName = 'First name is required.';
    } else if (formData.firstName.trim().length < 2) {
      errs.firstName = 'First name must be at least 2 characters.';
    }

    if (!formData.lastName.trim()) {
      errs.lastName = 'Last name is required.';
    } else if (formData.lastName.trim().length < 2) {
      errs.lastName = 'Last name must be at least 2 characters.';
    }

    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required.';
    } else if (!dobValid) {
      errs.dateOfBirth = 'Please fix date of birth requirements.';
    }

    // Phone regex: matches basic standard formats with optional country code
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    if (!formData.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phoneNumber.trim())) {
      errs.phoneNumber = 'Invalid phone number format. Example: +1 (555) 019-2834';
    }

    if (!formData.address.street.trim()) {
      errs['address.street'] = 'Street address is required.';
    }

    if (!formData.address.city.trim()) {
      errs['address.city'] = 'City is required.';
    }

    if (!formData.address.zipCode.trim()) {
      errs['address.zipCode'] = 'Postal / Zip code is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Personal Identity Section */}
      <div
        className="d-flex align-items-center gap-3 pb-3 mb-4"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div
          className="rounded-3 p-2 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', width: '38px', height: '38px' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-white fs-6">Personal &amp; Contact Details</h5>
          <small className="text-muted" style={{ fontSize: '0.8rem' }}>
            Managed via custom enterprise forms; synced to corporate directory
          </small>
        </div>
      </div>


      <div className="row g-3">
        <div className="col-md-6">
          <FormField
            id="firstName"
            label="First Name"
            value={formData.firstName}
            required
            error={errors.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div className="col-md-6">
          <FormField
            id="lastName"
            label="Last Name"
            value={formData.lastName}
            required
            error={errors.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <DatePickerField
            id="dateOfBirth"
            label="Date of Birth"
            value={formData.dateOfBirth}
            required
            error={errors.dateOfBirth}
            minAge={18}
            onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
            onValidationChange={(isValid, msg) => {
              setDobValid(isValid);
              if (!isValid && msg) {
                setErrors((prev) => ({ ...prev, dateOfBirth: msg }));
              } else {
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.dateOfBirth;
                  return updated;
                });
              }
            }}
          />
        </div>
        <div className="col-md-6">
          <FormField
            id="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            required
            placeholder="+1 (555) 019-2834"
            error={errors.phoneNumber}
            helperText="Used for SMS security alerts &amp; directory lookup"
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
      </div>

      {/* Address Details Section */}
      <div
        className="d-flex align-items-center gap-3 pb-3 mb-4 mt-5"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div
          className="rounded-3 p-2 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', width: '38px', height: '38px' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-white fs-6">Residential &amp; Office Address</h5>
          <small className="text-muted" style={{ fontSize: '0.8rem' }}>
            Physical location details for employee enterprise dispatch
          </small>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <FormField
            id="street"
            label="Street Address"
            value={formData.address.street}
            required
            error={errors['address.street']}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-5">
          <FormField
            id="city"
            label="City"
            value={formData.address.city}
            required
            error={errors['address.city']}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, city: e.target.value },
              })
            }
          />
        </div>
        <div className="col-md-4">
          <SelectDropdown
            id="state"
            label="State / Province"
            value={formData.address.state}
            options={US_STATES}
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, state: e.target.value },
              })
            }
          />
        </div>
        <div className="col-md-3">
          <FormField
            id="zipCode"
            label="Postal / Zip"
            value={formData.address.zipCode}
            required
            error={errors['address.zipCode']}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, zipCode: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <SelectDropdown
            id="country"
            label="Country"
            value={formData.address.country}
            options={COUNTRIES}
            required
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, country: e.target.value },
              })
            }
          />
        </div>
      </div>

      {/* Custom Enterprise Attributes */}
      <div
        className="d-flex align-items-center gap-3 pb-3 mb-4 mt-5"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div
          className="rounded-3 p-2 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', width: '38px', height: '38px' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-white fs-6">Enterprise Custom Attributes</h5>
          <small className="text-muted" style={{ fontSize: '0.8rem' }}>
            Corporate business metadata mapped directly to directory claims
          </small>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <SelectDropdown
            id="department"
            label="Assigned Department"
            value={formData.customAttributes.department || ''}
            options={DEPARTMENTS}
            onChange={(e) =>
              setFormData({
                ...formData,
                customAttributes: { ...formData.customAttributes, department: e.target.value },
              })
            }
          />
        </div>
        <div className="col-md-6">
          <FormField
            id="employeeId"
            label="Corporate Employee ID"
            value={formData.customAttributes.employeeId || ''}
            placeholder="EMP-84920"
            onChange={(e) =>
              setFormData({
                ...formData,
                customAttributes: { ...formData.customAttributes, employeeId: e.target.value },
              })
            }
          />
        </div>
      </div>

      {/* Security Note Alert */}
      <div
        className="d-flex align-items-center gap-3 p-3 rounded-3 mt-4"
        style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: '32px',
            height: '32px',
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            minWidth: '32px',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <small style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
          <strong className="text-white">Security Policy:</strong> Password changes, two-factor authentication factors, and company access policies are managed through your corporate identity provider.
        </small>
      </div>

      {/* Form Submission Buttons */}
      <div
        className="d-flex justify-content-end align-items-center gap-3 mt-4 pt-4"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <button
          type="button"
          className="btn btn-secondary-glass"
          disabled={isLoading}
          onClick={() => window.location.reload()}
        >
          Reset
        </button>
        <button type="submit" className="btn btn-gradient" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              Saving Profile Changes...
            </>
          ) : (
            <>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Profile Changes
            </>
          )}
        </button>
      </div>

    </form>
  );
};
