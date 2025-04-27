
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    // Return a loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-spiritual-light">
        <div className="text-center">
          <p className="text-2xl font-bold text-spiritual-dark mb-4">טוען...</p>
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-24 bg-spiritual-dark rounded"></div>
            <div className="h-4 w-24 bg-spiritual-dark rounded"></div>
            <div className="h-4 w-24 bg-spiritual-dark rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page and preserve the intended destination
  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
