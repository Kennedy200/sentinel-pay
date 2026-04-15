import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('accessToken');
  
  // If no token exists, send them back to login
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;