import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="py-4 mt-auto"
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container-fluid px-4 max-w-7xl">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="#fff" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="text-white fw-semibold small">APEX IDENTITY SUITE</span>
              <span className="text-secondary small ms-2 d-none d-sm-inline">
                &bull; Enterprise Identity &amp; Access Management
              </span>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small">
            <span className="d-flex align-items-center gap-1" style={{ color: '#cbd5e1' }}>
              <span className="pulse-dot" style={{ backgroundColor: '#10b981', width: '6px', height: '6px' }}></span>
              All Systems Operational
            </span>
            <span>&bull;</span>
            <span style={{ color: '#cbd5e1' }}>Enterprise Security</span>
            <span>&bull;</span>
            <span style={{ color: '#cbd5e1' }}>Privacy Policy</span>
            <span>&bull;</span>
            <span className="text-muted">&copy; {new Date().getFullYear()} Apex Global Inc.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

