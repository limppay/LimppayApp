import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login-cliente" />;
  }

  return children;
};

export default ProtectedRoute;
