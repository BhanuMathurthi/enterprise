import React from 'react';
import { UserProfile } from '../../types/user';
import { AccountStatusBadge } from './AccountStatusBadge';

interface ProfileSummaryCardProps {
  profile: UserProfile;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({ profile }) => {
  return (
    <div className="enterprise-card mb-4"
         style={{
           background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
           border: '1px solid rgba(255, 255, 255, 0.1)',
         }}>
      <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-4">
        
        {/* User Identity Info */}
        <div className="d-flex align-items-center gap-3 gap-md-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow-lg text-white"
            style={{
              width: '74px',
              height: '74px',
              fontSize: '1.75rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>

          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h3 className="mb-0 fw-bold text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {profile.firstName} {profile.lastName}
              </h3>
              <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1" style={{ fontSize: '0.72rem' }}>
                ✓ Verified Identity
              </span>
            </div>

            <div className="text-secondary small mb-2 d-flex flex-wrap align-items-center gap-3" style={{ color: '#94a3b8' }}>
              <span>✉️ {profile.email}</span>
              <span>🏢 {profile.customAttributes?.department || 'Enterprise Identity'}</span>
              <span>🆔 {profile.customAttributes?.employeeId || 'EMP-90210'}</span>
            </div>

            <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.78rem' }}>
              <span className="text-muted">Directory ID:</span>
              <span className="px-2 py-0.5 rounded text-white fw-medium" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                {profile.externalIdentityId || profile.id}
              </span>
            </div>
          </div>
        </div>

        {/* Status & Quick Stats */}
        <div className="d-flex flex-column align-items-start align-items-lg-end gap-2">
          <AccountStatusBadge status={profile.status} />
          <div className="text-muted small mt-1">
            Last synced: <span className="text-white">{new Date(profile.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="d-flex align-items-center gap-2 mt-1">
            <span className="badge px-2 py-1 rounded-pill" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.7rem' }}>
              MFA Enabled
            </span>
            <span className="badge px-2 py-1 rounded-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.7rem' }}>
              Directory Active
            </span>
          </div>
        </div>


      </div>
    </div>
  );
};
