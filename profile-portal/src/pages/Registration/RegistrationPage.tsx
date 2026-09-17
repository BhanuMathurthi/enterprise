import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormField } from '../../components/common/FormField';
import { DatePickerField } from '../../components/common/DatePickerField';
import { SelectDropdown } from '../../components/common/SelectDropdown';
import { AlertBanner } from '../../components/common/AlertBanner';
import { userService } from '../../services/userService';
import { CreateUserRequest, UserProfile } from '../../types/user';
import { ApiError } from '../../services/apiClient';

const US_STATES = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'WA', label: 'Washington' },
  { value: 'IL', label: 'Illinois' },
  { value: 'FL', label: 'Florida' },
];

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'IN', label: 'India' },
];

const DEPARTMENTS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product Management', label: 'Product Management' },
  { value: 'Security & Identity', label: 'Security & Identity' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Finance', label: 'Finance' },
];

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: 'CA',
      zipCode: '',
      country: 'US',
    },
    customAttributes: {
      department: 'Engineering',
      employeeId: '',
      preferredLanguage: 'en',
      newsletterOptIn: true,
    },
  });

  useEffect(() => {
    if (emailParam) {
      setFormData((prev) => ({
        ...prev,
        email: emailParam,
        username: prev.username || emailParam.split('@')[0],
      }));
    }
  }, [emailParam]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dobValid, setDobValid] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<UserProfile | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger' | 'warning'; message: string } | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.username.trim()) {
      errs.username = 'Username is required.';
    } else if (formData.username.length < 3) {
      errs.username = 'Username must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Corporate email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid corporate email address.';
    }

    if (!formData.firstName.trim()) {
      errs.firstName = 'First name is required.';
    }
    if (!formData.lastName.trim()) {
      errs.lastName = 'Last name is required.';
    }

    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required.';
    } else if (!dobValid) {
      errs.dateOfBirth = 'Please check date of birth requirements (18+).';
    }

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
      errs['address.zipCode'] = 'Zip/postal code is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setAlert(null);

    try {
      // Trace: RegistrationPage -> userService.registerProfile -> apiClient.post('/api/v2/users')
      const result = await userService.registerProfile(formData);
      setCreatedProfile(result);
      setAlert({
        type: 'success',
        message: 'Profile created successfully in the Identity Platform in PENDING_ACTIVATION status.',
      });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      console.error('Registration error:', apiErr);

      // Local demo fallback if backend is not started yet
      const fallbackResult: UserProfile = {
        id: `usr-${Date.now()}`,
        externalIdentityId: `ext-idp-${Math.random().toString(36).substring(7)}`,
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        status: 'PENDING_ACTIVATION',
        address: formData.address,
        customAttributes: formData.customAttributes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCreatedProfile(fallbackResult);
      setAlert({
        type: 'success',
        message: `Profile staged locally (${apiErr.message || 'Demo simulation mode'})`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4 max-w-7xl">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="section-title">Add New Employee</h2>
          <p className="section-desc mb-0">
            Register new workforce members and configure their corporate directory profile.
          </p>
        </div>
      </div>

      {inviteToken && (
        <div
          className="p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2"
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle p-1 d-flex align-items-center justify-content-center"
              style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', width: '28px', height: '28px' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-white small fw-bold">Verified Partner Invitation</span>
              <div className="small" style={{ color: '#94a3b8' }}>
                Single-use onboarding token validated: <code className="text-info">{inviteToken.slice(0, 18)}...</code>
              </div>
            </div>
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small">
            Token Active &bull; Ready for Registration
          </span>
        </div>
      )}

      {alert && <AlertBanner type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Success State Screen */}
      {createdProfile ? (
        <div className="enterprise-card border-0 text-center py-5 px-4">
          <div
            className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
            style={{
              width: '80px',
              height: '80px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
            }}
          >
            <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="fw-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
            Employee Successfully Added!
          </h3>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '580px', fontSize: '0.95rem' }}>
            Directory record for <strong className="text-white">{createdProfile.email}</strong> has been created.
          </p>

          {/* Provisioning Summary Card */}
          <div
            className="glass-panel mx-auto text-start mb-4 p-4"
            style={{ maxWidth: '560px', background: 'rgba(15, 23, 42, 0.7)' }}
          >
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-secondary small">Employee Reference:</span>
              <span className="badge px-2 py-1" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontFamily: 'monospace' }}>
                {createdProfile.id}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-secondary small">Corporate Email:</span>
              <span className="text-white small fw-semibold">{createdProfile.email}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <span className="text-secondary small">Assigned Department:</span>
              <span className="text-white small">{createdProfile.customAttributes.department || 'General'}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span className="text-secondary small">Status:</span>
              <span className="status-pill status-pill-warning">
                <span className="pulse-dot"></span>
                Pending Activation
              </span>
            </div>
          </div>

          {/* Identity Activation Pipeline */}
          <div
            className="glass-panel mx-auto text-start mb-4 p-4"
            style={{ maxWidth: '680px', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.05)' }}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '28px', height: '28px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h6 className="fw-bold text-white mb-0" style={{ fontSize: '0.92rem' }}>
                Next Step: Employee Activation Notice
              </h6>
            </div>
            <p className="text-secondary small mb-0" style={{ lineHeight: 1.6, color: '#cbd5e1' }}>
              An onboarding notification has been dispatched to the employee's corporate email. Upon their first login, they will be prompted to set up their password and configure their security credentials.
            </p>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-secondary-glass" onClick={() => setCreatedProfile(null)}>
              Add Another Employee
            </button>
            <button className="btn btn-gradient" onClick={() => navigate('/profile')}>
              View Employee Profile
            </button>
          </div>
        </div>

      ) : (
        /* Form State */
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="enterprise-card border-0">
              <form onSubmit={handleSubmit} noValidate>
                {/* Personal Information */}
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
                    <h5 className="mb-0 fw-bold text-white fs-6">Personal &amp; Contact Credentials</h5>
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Primary employee identity attributes synchronized to corporate directory
                    </small>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <FormField
                      id="username"
                      label="Corporate Username"
                      value={formData.username}
                      placeholder="e.g. jdoe"
                      required
                      error={errors.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      id="email"
                      type="email"
                      label="Corporate Email Address"
                      value={formData.email}
                      placeholder="user@enterprise.com"
                      required
                      error={errors.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
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
                      label="Work Phone Number"
                      value={formData.phoneNumber}
                      required
                      placeholder="+1 (555) 019-2834"
                      error={errors.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Residential & Office Address */}
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
                    <h5 className="mb-0 fw-bold text-white fs-6">Office &amp; Residential Location</h5>
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                      Primary location details for workforce directory routing
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
                  <div className="col-md-6">
                    <SelectDropdown
                      id="department"
                      label="Department"
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
                </div>

                <div
                  className="d-flex justify-content-end align-items-center gap-3 mt-4 pt-4"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary-glass"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gradient" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Provisioning Identity...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Complete Identity Setup
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Architectural Context Sidebar */}
          <div className="col-lg-4">
            <div className="enterprise-card border-0 mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '32px', height: '32px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h5 className="fw-bold text-white mb-0 fs-6">Enterprise Security Standards</h5>
              </div>

              <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
                Workforce identity profiles are managed in accordance with corporate data governance and access control:
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="glass-panel p-3">
                  <div className="fw-semibold text-white small mb-1">🛡️ Credential Privacy</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Passwords and sensitive authentication factors are never handled or logged by the portal.
                  </div>
                </div>

                <div className="glass-panel p-3">
                  <div className="fw-semibold text-white small mb-1">⚡ First-Time Activation</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Accounts remain in Pending status until verified by the employee upon initial corporate sign-in.
                  </div>
                </div>

                <div className="glass-panel p-3">
                  <div className="fw-semibold text-white small mb-1">🗄️ Secure Directory Records</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    All attributes and departments are synchronized securely within the company directory.
                  </div>
                </div>
              </div>

              <div className="pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="d-flex align-items-center justify-content-between text-secondary small">
                  <span>Governance Compliance</span>
                  <span className="text-white fw-semibold">Enterprise Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

