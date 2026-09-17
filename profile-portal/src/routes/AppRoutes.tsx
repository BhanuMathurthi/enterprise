import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ManageProfilePage } from '../pages/ManageProfile/ManageProfilePage';
import { RegistrationPage } from '../pages/Registration/RegistrationPage';
import { LegacyDemoPage } from '../pages/LegacyDemo/LegacyDemoPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ManageProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/legacy-demo" element={<LegacyDemoPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
