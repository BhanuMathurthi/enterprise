import React from 'react';

interface AlertBannerProps {
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, onClose }) => {
  const stylesMap = {
    success: {
      background: 'rgba(16, 185, 129, 0.12)',
      border: '1px solid rgba(16, 185, 129, 0.35)',
      color: '#34d399',
      iconColor: '#10b981',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.12)',
      border: '1px solid rgba(239, 68, 68, 0.35)',
      color: '#f87171',
      iconColor: '#ef4444',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      color: '#fbbf24',
      iconColor: '#f59e0b',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      background: 'rgba(6, 182, 212, 0.12)',
      border: '1px solid rgba(6, 182, 212, 0.35)',
      color: '#22d3ee',
      iconColor: '#06b6d4',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const current = stylesMap[type];

  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4 shadow-sm"
      style={{
        background: current.background,
        border: current.border,
        color: current.color,
        backdropFilter: 'blur(8px)',
      }}
      role="alert"
    >
      <div className="d-flex align-items-center gap-3">
        <span style={{ color: current.iconColor }}>{current.icon}</span>
        <div className="fw-medium small" style={{ color: '#f1f5f9' }}>{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm text-secondary p-0 ms-3"
          style={{ background: 'transparent', border: 'none', lineHeight: 1 }}
          aria-label="Dismiss alert"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

