import { useSocket } from '@/hooks/base/use-socket';
import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

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

  // Select state and functions from the store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const checkPermission = useAuthStore((state) => state.checkPermission);

  useSocket<object>('private', 'connect', (data) => {
    console.log(data);
  });

  // 1. First, check if the user is authenticated at all.
  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination.
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Next, check for authorization (permissions) if any are required.
  if (requiredPermissions && requiredPermissions.length > 0) {
    // Use `some()` to check if the user has AT LEAST ONE of the required permissions.
    // This directly implements the logic you asked for.
    const hasRequiredPermission = requiredPermissions.some((perm) =>
      checkPermission(perm)
    );

    if (!hasRequiredPermission) {
      // User is logged in but lacks the necessary permissions for this route.
      return <Navigate to={onAuthorizationFailRedirect} replace />;
    }
  }

  // 3. If all checks pass, render the content.
  // This supports both <ProtectedRoute><Page /></ProtectedRoute> and nested routes via <Outlet />.
  return children ? <>{children}</> : <Outlet />;
};
