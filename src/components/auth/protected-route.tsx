import { usePrivateSocket } from '@/hooks/base/use-socket';
import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  /** The children to render. If not provided, renders an <Outlet /> for nested routes. */
  children?: React.ReactNode;
  /** An array of permissions required. Access is granted if the user has AT LEAST ONE. */
  requiredPermissions?: string[];
  /** Path to redirect to if not authenticated. Defaults to "/login". */
  redirectTo?: string;
  /** Path to redirect to if authenticated but not authorized. Defaults to "/unauthorized". */
  onAuthorizationFailRedirect?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions,
  redirectTo = '/login',
  onAuthorizationFailRedirect = '/unauthorized'
}) => {
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkPermission = useAuthStore((state) => state.checkPermission);

  usePrivateSocket<object>('connect', (data) => {
    console.log(data);
  });

  usePrivateSocket('wellcome', (message) => {
    console.log('current message is ', message);
    toast.success(message as unknown as string);
  });

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some((perm) =>
      checkPermission(perm)
    );

    if (!hasRequiredPermission) {
      return <Navigate to={onAuthorizationFailRedirect} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};
