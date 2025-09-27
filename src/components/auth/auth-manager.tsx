import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';

/**
 * This component should be mounted at the root of your application.
 * It's responsible for initializing the proactive token refresh mechanism
 * when the application loads.
 */
export const AuthManager = () => {
  // We use a "transient" update to get the non-reactive function.
  // This prevents the component from re-rendering when the store changes.
  const startTokenRefreshInterval =
    useAuthStore.getState().startTokenRefreshInterval;
  const isAuthenticated = useAuthStore((state) => !!state.token.access);

  useEffect(() => {
    // When the component mounts, if the user is authenticated (from persisted state),
    // start the token refresh interval.
    if (isAuthenticated) {
      console.log('User is authenticated, starting token refresh interval.');
      startTokenRefreshInterval();
    }

    // The cleanup function for useEffect will run on unmount, but since this
    // component is at the root, it effectively won't be called. The store's
    // logout function is responsible for cleanup.
  }, [isAuthenticated, startTokenRefreshInterval]);

  // This component renders nothing. Its only purpose is to run the effect.
  return null;
};
