import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container py-5 text-center">
      <div className="enterprise-card border-0 mx-auto py-5" style={{ maxWidth: '540px' }}>
        <h1 className="display-1 fw-bold gradient-text mb-2">404</h1>
        <h3 className="fw-bold text-white mb-2">Identity Resource Not Found</h3>
        <p className="text-secondary mb-4">
          The requested identity endpoint or navigation route does not exist within the directory.
        </p>
        <Link to="/profile" className="btn btn-gradient">
          Return to Identity Portal
        </Link>
      </div>
    </div>
  );
};

