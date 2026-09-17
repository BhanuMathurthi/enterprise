import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, login } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky-top" style={{ zIndex: 1020 }}>
      <nav
        className="navbar navbar-expand-lg px-3 px-lg-4 py-3"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container-fluid max-w-7xl">
          {/* Logo & Brand */}
          <Link className="navbar-brand d-flex align-items-center gap-3 text-decoration-none" to="/profile">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                boxShadow: '0 0 15px rgba(79, 70, 229, 0.5)',
              }}
            >
              <svg width="22" height="22" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white fs-5 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  APEX IDENTITY
                </span>
                <span
                  className="badge px-2 py-1 rounded-pill"
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.18)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  Enterprise Suite
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', letterSpacing: '0.02em' }}>
                Corporate Identity Portal
              </div>
            </div>
          </Link>

          {/* Navigation Items with High-Contrast Text */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul
              className="navbar-nav p-1 rounded-pill"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <li className="nav-item">
                <Link
                  className="nav-link px-3 py-1 rounded-pill"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: isActive('/profile') ? 600 : 500,
                    color: isActive('/profile') ? '#ffffff' : '#e2e8f0',
                    background: isActive('/profile')
                      ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                      : 'transparent',
                    boxShadow: isActive('/profile') ? '0 2px 10px rgba(79, 70, 229, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  to="/profile"
                >
                  👤 Manage Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link px-3 py-1 rounded-pill"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: isActive('/register') ? 600 : 500,
                    color: isActive('/register') ? '#ffffff' : '#e2e8f0',
                    background: isActive('/register')
                      ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)'
                      : 'transparent',
                    boxShadow: isActive('/register') ? '0 2px 10px rgba(79, 70, 229, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  to="/register"
                >
                  ✨ Add Employee
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link px-3 py-1 rounded-pill"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: isActive('/legacy-demo') ? 600 : 500,
                    color: isActive('/legacy-demo') ? '#ffffff' : '#e2e8f0',
                    background: isActive('/legacy-demo')
                      ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                      : 'transparent',
                    boxShadow: isActive('/legacy-demo') ? '0 2px 10px rgba(245, 158, 11, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                  to="/legacy-demo"
                >
                  ✉️ Invitations
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Controls: User Session */}
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill"
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-white small pe-2 fw-medium">
                    {user?.name || user?.email}
                  </span>
                </div>
                <button
                  className="btn btn-sm text-light px-3 py-1 rounded-pill"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '0.8rem',
                    color: '#f8fafc',
                  }}
                  onClick={logout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-gradient btn-sm px-3 py-1 rounded-pill"
                onClick={() => login('/profile')}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

