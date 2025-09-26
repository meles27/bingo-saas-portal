import { useMemo, useReducer } from 'react';

// --- TYPES (No changes here) ---
type ActiveState<T extends string> = T | null;
type ActiveAction<T extends string> = { type: 'SET_ACTIVE'; payload: T | null };
export type OnBeforeCallback = () => unknown | Promise<unknown>;

// --- REDUCER (No changes here) ---
const activeReducer = <T extends string>(
  state: ActiveState<T>,
  action: ActiveAction<T>
): ActiveState<T> => {
  switch (action.type) {
    case 'SET_ACTIVE':
      if (state === action.payload) return state;
      return action.payload;
    default:
      return state;
  }
};

// --- HOOK (Updated) ---

/**
 * A custom hook to dynamically manage which single item is active from a list.
 *
 * It uses the `activeKeys` array for runtime validation and to enable navigational actions.
 * It supports running an optional callback function before any state change.
 *
 * @param activeKeys - An array of unique strings representing each possible active key. The order of this array is used for navigation.
 * @param defaultActiveKey - An optional key to be active on initial render.
 * @returns An object containing the activeKey, its index, navigational state, and action handlers.
 */
export const useActiveManager = <T extends string>(
  activeKeys: readonly T[],
  defaultActiveKey?: T
) => {
  const initialState: ActiveState<T> = defaultActiveKey ?? null;

  const [activeKey, dispatch] = useReducer(activeReducer<T>, initialState);

  // --- NEW: DERIVED STATE FROM activeKeys ---
  const { currentIndex, isFirst, isLast } = useMemo(() => {
    const index = activeKey ? activeKeys.indexOf(activeKey) : -1;
    return {
      currentIndex: index,
      isFirst: index === 0,
      isLast: index === activeKeys.length - 1
    };
  }, [activeKey, activeKeys]);

  // --- ACTIONS (Updated with validation and navigation) ---
  const actions = useMemo(() => {
    const setActive = async (key: T | null, onBefore?: OnBeforeCallback) => {
      // 1. NEW: Runtime validation in development
      if (
        process.env.NODE_ENV === 'development' &&
        key !== null &&
        !activeKeys.includes(key)
      ) {
        console.warn(
          `useActiveManager: Attempted to set an invalid key "${key}". It is not present in the provided activeKeys array.`,
          activeKeys
        );
        return; // Abort the state change
      }

      let canProceed = true;
      if (onBefore) {
        const result = await Promise.resolve(onBefore());
        if (result === false) {
          canProceed = false;
        }
      }

      if (canProceed) {
        dispatch({ type: 'SET_ACTIVE', payload: key });
      }
    };

    const set = (key: T, onBefore?: OnBeforeCallback) => {
      setActive(key, onBefore);
    };

    const clear = (onBefore?: OnBeforeCallback) => {
      setActive(null, onBefore);
    };

    const toggle = (key: T, onBefore?: OnBeforeCallback) => {
      const newActiveKey = activeKey === key ? null : key;
      setActive(newActiveKey, onBefore);
    };

    const setNext = (onBefore?: OnBeforeCallback) => {
      if (isLast) return; // Already at the end
      const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1;
      setActive(activeKeys[nextIndex], onBefore);
    };

    const setPrevious = (onBefore?: OnBeforeCallback) => {
      if (isFirst || currentIndex === -1) return; // Already at the start or nothing is selected
      const prevIndex = currentIndex - 1;
      setActive(activeKeys[prevIndex], onBefore);
    };

    const setFirst = (onBefore?: OnBeforeCallback) => {
      setActive(activeKeys[0], onBefore);
    };

    const setLast = (onBefore?: OnBeforeCallback) => {
      setActive(activeKeys[activeKeys.length - 1], onBefore);
    };

    return { set, clear, toggle, setNext, setPrevious, setFirst, setLast };
  }, [activeKey, activeKeys, currentIndex, isFirst, isLast]); // Dependencies updated

  return {
    /** The key of the currently active item, or null if no item is active. */
    activeKey,
    /** The index of the active key in the `activeKeys` array. Returns -1 if none is active. */
    currentIndex,
    /** A boolean indicating if the currently active item is the first in the array. */
    isFirst,
    /** A boolean indicating if the currently active item is the last in the array. */
    isLast,
    /** A memoized object of async functions to manipulate the active state. */
    actions
  };
};
