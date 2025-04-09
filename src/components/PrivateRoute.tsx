
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PrivateRoute: React.FC = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
