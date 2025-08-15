import { socketManager } from '@/lib/socket-manager';
import type { ServerToClientEvents } from '@/types/base/socket-events.type';
import { useCallback, useEffect } from 'react';

/**
 * A type-safe custom hook to manage Socket.IO event listeners within a React component.
 * It ensures listeners are added on mount and removed on unmount.
 *
 * @param eventName The event to listen for (must be a key of ServerToClientEvents).
 * @param handler The callback function to handle the event (must match the event's signature).
 */
export const useSocket = <E extends keyof ServerToClientEvents>(
  eventName: E,
  handler: ServerToClientEvents[E]
) => {
  // Memoize the handler to prevent re-registering the listener on every render if the handler is defined inline.
  const memoizedHandler = useCallback(handler, [handler]);

  useEffect(() => {
    // Register the event listener when the component mounts
    socketManager.on(eventName, memoizedHandler);

    // Cleanup: Unregister the event listener when the component unmounts
    return () => {
      socketManager.off(eventName, memoizedHandler);
    };
  }, [eventName, memoizedHandler]); // Effect dependencies
};
