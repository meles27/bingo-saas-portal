import { socketManager, type NamespaceType } from '@/lib/socket/socket-manager';
import {
  SocketEvent,
  type SocketEventHandler
} from '@/lib/socket/socket.schema';
import { useCallback, useEffect } from 'react';

/**
 * A type-safe custom React hook to manage a Socket.IO event listener.
 * It ensures the listener is correctly added when the component mounts and
 * removed when it unmounts.
 *
 * @example
 * useSocket('private', SocketEvent.T_NEW_NUMBER_CALLED, (response) => {
 *   // `response` is fully typed here!
 *   console.log('New number:', response.payload.number);
 * });
 *
 * @template E - The specific event from the SocketEvent enum you are listening for.
 * @param {NamespaceType} namespace - The namespace to listen on ('private' or 'public').
 * @param {E} eventName - The strongly-typed event name.
 * @param {SocketEventHandler<E>} handler - The callback function to execute. Its argument is automatically typed based on the eventName.
 */
export const useSocket = <E extends SocketEvent>(
  namespace: NamespaceType,
  eventName: E,
  handler: SocketEventHandler<E>
) => {
  // Memoize the handler to prevent re-subscribing on every component render if the handler is defined inline.
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    const socket = socketManager.getSocket(namespace);
    if (socket) {
      // The type assertion is safe because we know our handler's signature matches the event.
      socket.on(eventName, memoizedHandler as (...args: any[]) => void);
    }

    // The cleanup function is crucial to prevent memory leaks and duplicate listeners.
    return () => {
      socket?.off(eventName, memoizedHandler as (...args: any[]) => void);
    };
  }, [namespace, eventName, memoizedHandler]);
};

// --- Convenience Hooks ---

/** Listens on the 'private' (authenticated) namespace. */
export const usePrivateSocket = <E extends SocketEvent>(
  eventName: E,
  handler: SocketEventHandler<E>
) => {
  return useSocket('private', eventName, handler);
};

/** Listens on the 'public' namespace. */
export const usePublicSocket = <E extends SocketEvent>(
  eventName: E,
  handler: SocketEventHandler<E>
) => {
  return useSocket('public', eventName, handler);
};
