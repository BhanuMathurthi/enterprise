import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading identity records...',
  size = 'md',
}) => {
  const dimension = size === 'sm' ? 24 : size === 'lg' ? 56 : 38;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div
        className="spinner-border"
        role="status"
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          borderWidth: '3px',
          borderColor: 'rgba(99, 102, 241, 0.25)',
          borderTopColor: '#6366f1',
          filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.4))',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-secondary small fw-medium">{message}</p>}
    </div>
  );
};

