import LoadingScreen from '../components/LoadingScreen';
import { Navigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../routes/paths';
import { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import React from 'react';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
