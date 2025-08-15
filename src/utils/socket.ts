/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConfigStore } from '@/store/configStore';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

//npm install lodash-es

// Define types for event status and event type
type EventStatus = 'success' | 'error';

// Conditional type: If status is "error", data must be null
export type SocketEvent<T, S extends EventStatus> = {
  event: string;
  status: S;
  entity: string;
  count: number;
  data: S extends 'error' ? null : T[]; // Enforce `null` only for "error" status
  timestamp: string;
  message: string;
};

let socket: Socket;
export function getSocket() {
  if (!socket) {
    socket = io(useConfigStore.getState().BASE_URL, {
      withCredentials: true
    });
  } else {
    if (socket.disconnected) {
      socket = io(useConfigStore.getState().BASE_URL, {
        withCredentials: true
      });
    }
  }

  return socket;
}

(function () {
  socket = getSocket();
  if (socket) {
    socket.on('connect', () => {
      toast.info(`connected`);
    });
    socket.on('disconnect', () => {
      toast.warning('disconnected');
    });
  }
})();

// const customizer = (objValue: any, srcValue: any) => {
//   if (Array.isArray(objValue)) {
//     return srcValue; // Replace the array instead of merging
//   }
// };

export function updateList(bigList: any[], newList: any[]): any[] {
  /**
   * Step 1: Create a new Map from bigList to ensure immutability
   */
  const bigListMap = new Map(bigList.map((item) => [item.id, { ...item }]));
  /**
   * Step 2: Iterate through newList and update bigListMap
   */
  newList.forEach((newItem) => {
    if (bigListMap.has(newItem.id)) {
      /**
       * Deep merge the existing item with the new item
       */
      // bigListMap.set(
      //   newItem.id,
      //   merge(bigListMap.get(newItem.id), newItem, customizer)
      // );
    }
  });
  /**
   * Step 3: Convert Map back to an array
   */
  return Array.from(bigListMap.values());
}

export function removeList(
  bigList: any[],
  removeList: any[]
): { results: any[]; totalHit: number } {
  let totalHit = 0;
  // Step 1: Create a Set of IDs to remove (O(1) lookups)
  const removeSet = new Set(removeList.map((item) => item.id));
  // Step 2: Filter out items that exist in the removeSet
  return {
    results: bigList.filter((item) => {
      if (!removeSet.has(item.id)) {
        return true;
      } else {
        totalHit += 1;
        return false;
      }
    }),
    totalHit
  };
}

// function mergeWith(
//   arg0: any,
//   newItem: any,
//   customizer: (objValue: any, srcValue: any) => any
// ): any {
//   throw new Error('Function not implemented.');
// }
