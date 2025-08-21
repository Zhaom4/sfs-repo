import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserContext();
  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    // Give auth time to initialize on first load
    const timer = setTimeout(() => {
      setInitialCheck(false);
    }, 1000); // Wait 1 second for auth to settle

    return () => clearTimeout(timer);
  }, []);

  // Show loading during initial auth check
  if (loading || initialCheck) {
    return (
      <Loader></Loader>
    );
  }

  // Redirect to login if not authenticated after initial check
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;