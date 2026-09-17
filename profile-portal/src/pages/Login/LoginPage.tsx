import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-4 py-lg-5">
      <div className="row g-5 align-items-center justify-content-center">
        {/* Left Column: Enterprise Security Value Showcase */}
        <div className="col-lg-6 col-xl-5 text-start">
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4"
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            <span className="pulse-dot" style={{ backgroundColor: '#818cf8' }}></span>
            ENTERPRISE WORKFORCE SECURITY
          </div>

          <h1 className="display-5 fw-bold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Modern Identity, <br />
            <span className="gradient-text">Unified Access.</span>
          </h1>

          <p className="fs-6 mb-4" style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
            Access and manage your verified enterprise profile, corporate credentials, and organizational directory records with seamless single sign-on.
          </p>

          {/* Feature Grid */}
          <div className="d-flex flex-column gap-3 mb-5">
            <div className="glass-panel d-flex align-items-start gap-3 py-3 px-3">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', minWidth: '40px', minHeight: '40px' }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h6 className="fw-semibold text-white mb-1" style={{ fontSize: '0.95rem' }}>Secure Corporate Authentication</h6>
                <p className="mb-0" style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Log in securely using your existing company credentials with enforced multi-factor verification.
                </p>
              </div>
            </div>

            <div className="glass-panel d-flex align-items-start gap-3 py-3 px-3">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', minWidth: '40px', minHeight: '40px' }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h6 className="fw-semibold text-white mb-1" style={{ fontSize: '0.95rem' }}>Automated Directory Synchronization</h6>
                <p className="mb-0" style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Profile updates, departments, and contact details update in real time across the corporate network.
                </p>
              </div>
            </div>

            <div className="glass-panel d-flex align-items-start gap-3 py-3 px-3">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', minWidth: '40px', minHeight: '40px' }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h6 className="fw-semibold text-white mb-1" style={{ fontSize: '0.95rem' }}>Zero-Trust Privacy Protection</h6>
                <p className="mb-0" style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Sensitive employee attributes and contact information are encrypted both in transit and at rest.
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="badge rounded-pill bg-dark border border-secondary px-3 py-2" style={{ color: '#cbd5e1' }}>
              🛡️ SOC 2 TYPE II
            </span>
            <span className="badge rounded-pill bg-dark border border-secondary px-3 py-2" style={{ color: '#cbd5e1' }}>
              🔒 ISO 27001 CERTIFIED
            </span>
            <span className="badge rounded-pill bg-dark border border-secondary px-3 py-2" style={{ color: '#cbd5e1' }}>
              🌐 ZERO-TRUST READY
            </span>
          </div>
        </div>

        {/* Right Column: High-End Sign-In Card */}
        <div className="col-lg-5 col-xl-4">
          <div
            className="enterprise-card border-0 shadow-lg text-center p-4 p-md-5"
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
            }}
          >
            {/* Header Icon */}
            <div
              className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
              style={{
                width: '68px',
                height: '68px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                boxShadow: '0 0 25px rgba(79, 70, 229, 0.6)',
              }}
            >
              <svg width="32" height="32" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h3 className="fw-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              Corporate Single Sign-On
            </h3>
            <p className="small mb-4" style={{ color: '#cbd5e1' }}>
              Access the Enterprise Profile Portal using your company identity.
            </p>

            {isAuthenticated ? (
              <div
                className="glass-panel text-start mb-4"
                style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.08)' }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="pulse-dot" style={{ backgroundColor: '#10b981' }}></span>
                  <h6 className="fw-bold text-white mb-0" style={{ fontSize: '0.9rem' }}>Active Session Established</h6>
                </div>
                <div className="small mb-3" style={{ color: '#cbd5e1' }}>
                  <div><strong>User:</strong> <span className="text-white">{user?.name}</span></div>
                  <div><strong>Email:</strong> <span className="text-white">{user?.email}</span></div>
                </div>
                <button
                  className="btn btn-gradient w-100 py-2"
                  onClick={() => navigate('/profile')}
                >
                  Proceed to Profile &rarr;
                </button>
              </div>
            ) : (
              <div>
                {/* Enterprise Account Preview */}
                <div className="glass-panel text-start p-3 mb-4" style={{ background: 'rgba(30, 41, 59, 0.6)' }}>
                  <div className="text-secondary mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Verified Corporate Identity
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', fontSize: '0.85rem' }}
                    >
                      AM
                    </div>
                    <div>
                      <div className="fw-semibold text-white small">Alex Morgan</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>alex.morgan@enterprise.com</div>
                    </div>
                    <span className="badge ms-auto status-pill-success" style={{ fontSize: '0.7rem' }}>
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  className="btn btn-gradient w-100 py-3 fs-6 mb-3 shadow-lg"
                  onClick={() => login('/profile')}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In with Company Account
                </button>

                <div className="text-center small mb-3" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Supports corporate credentials via standard SSO
                </div>

                {/* Trust Footer */}
                <div className="border-top pt-3 text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div className="d-flex align-items-center justify-content-center gap-2" style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>256-Bit Encrypted &bull; Enforced Multi-Factor Authentication</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

