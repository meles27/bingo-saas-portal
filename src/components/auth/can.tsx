import { useAuthStore } from '@/store/auth-store';
import React from 'react';

// --- Component Props Interface ---
interface CanProps {
  /** The children to render if the user has the required permissions. */
  children: React.ReactNode;
  /** An array of permission strings. The children will be rendered if the user has AT LEAST ONE of these permissions. */
  I: string[];
}

/**
 * A component that conditionally renders its children based on the user's permissions.
 * It uses the `useAuthStore` to check if the user has at least one of the
 * `I`. If the check fails, it renders nothing.
 */
export const Can: React.FC<CanProps> = ({ children, I }) => {
  // 1. Select the permission checking function from the store.
  const checkPermission = useAuthStore((state) => state.checkPermission);

  // 2. If no permissions are required, there's no reason to hide the children.
  // This is a sensible default to avoid accidentally hiding content.
  if (!I || I.length === 0) {
    return <>{children}</>;
  }

  // 3. Use `some()` to check if the user has AT LEAST ONE of the required permissions.
  // This is the exact same logic as in your ProtectedRoute.
  const isAuthorized = I.some((permission) => checkPermission(permission));

  // 4. If the user is authorized, render the children. Otherwise, render nothing.
  return isAuthorized ? <>{children}</> : null;
};
