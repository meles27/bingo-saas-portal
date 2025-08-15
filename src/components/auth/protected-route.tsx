import { socketManager } from '@/lib/socket-manager';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  /** The children to render. If not provided, renders an <Outlet /> for nested routes. */
  children?: React.ReactNode;
  /** An array of permissions required. Access is granted if the user has AT LEAST ONE. */
  requiredPermissions?: string[];
  /** The specific branch ID to check permissions against. */
  branchId?: string;
  /** Path to redirect to if not authenticated. Defaults to "/login". */
  redirectTo?: string;
  /** Path to redirect to if authenticated but not authorized. Defaults to "/unauthorized". */
  onAuthorizationFailRedirect?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions,
  branchId,
  redirectTo = '/login',
  onAuthorizationFailRedirect = '/unauthorized'
}) => {
  // Select state and functions from the store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const checkPermission = useAuthStore((state) => state.checkPermission);
  const getTenantSubDomain = useConfigStore(
    (state) => state.getTenantSubDomain
  );

  const getTenantNamespace = useConfigStore(
    (state) => state.getTenantNamespace
  );

  const token = useAuthStore((state) => state.token);

  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const namespace = getTenantNamespace();
      const subdomain = getTenantSubDomain();
      socketManager.connect(token.access, subdomain, namespace);
    }
  }, [getTenantNamespace, getTenantSubDomain, isAuthenticated, token.access]);

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
      checkPermission(perm, branchId)
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
