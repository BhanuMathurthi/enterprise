import React from 'react';
import { UserStatus } from '../../types/user';

interface AccountStatusBadgeProps {
  status: UserStatus;
}

export const AccountStatusBadge: React.FC<AccountStatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Active & Verified',
          style: {
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
          },
          dotColor: '#10b981',
        };
      case 'PENDING_ACTIVATION':
        return {
          label: 'Pending First-Login Activation',
          style: {
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)',
          },
          dotColor: '#f59e0b',
        };
      case 'SUSPENDED':
        return {
          label: 'Suspended by IdP',
          style: {
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)',
          },
          dotColor: '#ef4444',
        };
      default:
        return {
          label: status,
          style: {
            backgroundColor: 'rgba(148, 163, 184, 0.12)',
            color: '#94a3b8',
            border: '1px solid rgba(148, 163, 184, 0.3)',
          },
          dotColor: '#64748b',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2"
      style={config.style}
    >
      <span
        className="pulse-dot"
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: config.dotColor,
          boxShadow: `0 0 8px ${config.dotColor}`,
        }}
      />
      <span className="fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
        {config.label}
      </span>
    </span>
  );
};
