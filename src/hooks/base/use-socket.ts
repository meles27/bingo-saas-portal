import {
  socketManager,
  type NamespaceType,
  type SocketEventListener
} from '@/lib/socket/socket-manager';
import { useCallback, useEffect } from 'react';

/**
 * A type-safe custom React hook to manage a Socket.IO event listener and ensure
 * a connection for the specified namespace is active when the component is mounted.
 *
 * @param namespace The namespace to connect to ('private' or 'public').
 * @param eventName The event to listen for from the server.
 * @param handler The callback function to execute when the event is received.
 */
export const useSocket = <T>(
  namespace: NamespaceType,
  eventName: string,
  handler: SocketEventListener<T>
) => {
  // Memoize the handler to prevent re-subscribing on every component render.
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    // If already connected, this does nothing. If not, it initiates connection.
    let socket = socketManager.getSocket(namespace);
    if (!socket || socket.disconnected) {
      socket = socketManager.connect(namespace);
    }

    // If a connection was successfully established (or already existed),
    if (socket) {
      socketManager.on(namespace, eventName, memoizedHandler);
    }

    // Cleanup function: This will be called when the component unmounts.
    return () => {
      socketManager.off(namespace, eventName, memoizedHandler);
    };
  }, [namespace, eventName, memoizedHandler]); // Re-run effect if these change.
};

export const usePrivateSocket = <T>(
  eventName: string,
  handler: SocketEventListener<T>
) => {
  return useSocket('private', eventName, handler);
};

export const usePublicSocket = <T>(
  eventName: string,
  handler: SocketEventListener<T>
) => {
  return useSocket('public', eventName, handler);
};
