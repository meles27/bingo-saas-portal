import { useAuthStore } from '@/store/auth-store';
import { useConfigStore } from '@/store/config-store';
import { socketManager } from './socket-manager';

let isInitialized = false;

/**
 * This function initializes the socket connection manager and makes it reactive
 * to the application's authentication state.
 * It should be called ONCE in your main App component or layout.
 */
export const initializeSocketConnection = () => {
  if (isInitialized) return;
  isInitialized = true;

  // Subscribe to the auth store to automatically manage private connections.
  useAuthStore.subscribe((state, prevState) => {
    const subdomain = useConfigStore.getState().tenant;
    if (!subdomain) return; // Cannot connect without a subdomain

    // User logged in: establish private connection.
    if (state.token?.access && !prevState.token?.access) {
      console.log(
        '[SocketBridge] Auth token detected. Connecting private socket.'
      );
      socketManager.connect('private', state.token.access);
    }
    // User logged out: terminate private connection.
    if (!state.token?.access && prevState.token?.access) {
      console.log(
        '[SocketBridge] Auth token removed. Disconnecting private socket.'
      );
      socketManager.disconnect('private');
    }
  });

  // Attempt an initial connection if the page loads and the user is already logged in.
  const initialToken = useAuthStore.getState().token?.access;
  if (initialToken) {
    socketManager.connect('private', initialToken);
  }
};
