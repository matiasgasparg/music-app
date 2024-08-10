import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
