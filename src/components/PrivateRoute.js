import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PrivateRoute = ({ component: Component }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
