import { useMemo, useReducer } from 'react';

// 1. DYNAMIC TYPES (Corrected)
// We remove `Uppercase<K>` to preserve the original casing in the type.
type VisibilityStates<T extends string> = Record<T, boolean>;

type VisibilityActions<T extends string> = {
  [K in T]: {
    type: `SET_${K}`;
    payload: boolean;
  };
}[T];

/**
 * A callback function that runs before a state change.
 * If it returns `false` or a Promise that resolves to `false`, the state change is cancelled.
 * @returns `void | boolean | Promise<void | boolean>`
 */
export type OnBeforeCallback = () => unknown | Promise<unknown>;

// 2. DYNAMIC REDUCER
const visibilityReducer = <T extends string>(
  state: VisibilityStates<T>,
  action: VisibilityActions<T>
): VisibilityStates<T> => {
  const key = action.type.substring(4) as T; // "SET_".length is 4

  if (Object.prototype.hasOwnProperty.call(state, key)) {
    // Avoids unnecessary re-renders if the state is already the same
    if (state[key] === action.payload) {
      return state;
    }
    return {
      ...state,
      [key]: action.payload
    };
  }

  return state;
};

/**
 * A custom hook to dynamically manage the state of multiple visibility flags (e.g., for modals or dialogs).
 *
 * It supports running an optional synchronous or asynchronous callback function before any state change.
 * If the callback returns `false`, the state change is aborted.
 *
 * @param visibilityKeys - An array of unique strings representing each visibility's key (case-sensitive).
 * @returns An object containing the visibility states and async action handlers.
 */
export const useVisibilityManager = <T extends string>(
  visibilityKeys: readonly T[]
) => {
  // 3. DYNAMIC INITIAL STATE (No changes needed here)
  const initialState = useMemo(
    () =>
      visibilityKeys.reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as VisibilityStates<T>),
    [visibilityKeys]
  );

  // 4. USE THE REDUCER (No changes needed here)
  const [states, dispatch] = useReducer(visibilityReducer<T>, initialState);

  // 5. MEMOIZED, ASYNC, USER-FRIENDLY ACTIONS (Corrected)
  const actions = useMemo(() => {
    const set = async (
      key: T,
      isOpen: boolean,
      onBefore?: OnBeforeCallback
    ) => {
      let canProceed = true;
      if (onBefore) {
        const result =
          onBefore instanceof Promise ? await onBefore() : onBefore();
        if (result === false) {
          canProceed = false;
        }
      }

      if (canProceed) {
        dispatch({
          type: `SET_${key}`,
          payload: isOpen
        } as VisibilityActions<T>);
      }
    };

    const open = (key: T, onBefore?: OnBeforeCallback) =>
      set(key, true, onBefore);

    const close = (key: T, onBefore?: OnBeforeCallback) =>
      set(key, false, onBefore);

    const toggle = (key: T, onBefore?: OnBeforeCallback) => {
      set(key, !states[key], onBefore);
    };

    return { set, open, close, toggle };
  }, [states]);

  return {
    states,
    actions
  };
};
