
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const PrivateRoute: React.FC = () => {
  const { state } = useAuth();
  const location = useLocation();

  // Check if token is expired and handle session timeout
  React.useEffect(() => {
    const tokenExpiry = localStorage.getItem('taskAceTokenExpiry');
    if (tokenExpiry && Number(tokenExpiry) < Date.now() && state.isAuthenticated) {
      toast.error("Your session has expired. Please login again.");
    }
  }, [state.isAuthenticated]);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return state.isAuthenticated ? 
    <Outlet /> : 
    <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
