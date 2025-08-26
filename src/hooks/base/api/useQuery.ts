import axiosInstance from '@/utils/interceptors';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

// --- Type Definitions ---

/**
 * A standardized error response structure for API queries.
 */
export interface AxiosBaseQueryErrorResponse {
  status: number | undefined;
  data: {
    detail: string;
    errors?: Record<string, unknown>;
  };
}

// --- Discriminated Union for Query Result ---

interface UseQueryBaseResult<T> {
  /**
   * Function to manually trigger a refetch of the query.
   * Returns a promise that resolves with the [data, error] tuple.
   */
  refetch: () => Promise<
    [T | undefined, AxiosBaseQueryErrorResponse | undefined]
  >;
}

interface UseQueryLoadingResult<T> extends UseQueryBaseResult<T> {
  data: T | null; // Can hold stale data while refetching
  error: null;
  isLoading: true;
  isSuccess: false;
  isError: false;
}

interface UseQuerySuccessResult<T> extends UseQueryBaseResult<T> {
  data: T; // Data is guaranteed to be present and non-nullable
  error: null;
  isLoading: false;
  isSuccess: true;
  isError: false;
}

interface UseQueryErrorResult<T> extends UseQueryBaseResult<T> {
  data: null;
  error: AxiosBaseQueryErrorResponse; // Error is guaranteed to be present
  isLoading: false;
  isSuccess: false;
  isError: true;
}

interface UseQueryIdleResult<T> extends UseQueryBaseResult<T> {
  data: null;
  error: null;
  isLoading: false;
  isSuccess: false;
  isError: false;
}

/**
 * The result of the useQuery hook, discriminated by the state flags
 * (isLoading, isSuccess, isError). This allows for type-safe access
 * to `data` and `error` properties.
 *
 * - When `isSuccess` is true, `data` is of type `T`.
 * - When `isError` is true, `error` is of type `AxiosBaseQueryErrorResponse`.
 * - When `isLoading` is true, `data` can be null (or hold stale data).
 */
export type UseQueryResult<T> =
  | UseQueryLoadingResult<T>
  | UseQuerySuccessResult<T>
  | UseQueryErrorResult<T>
  | UseQueryIdleResult<T>;

/**
 * Generates a structured error object from various error types.
 * @param error The error caught in a catch block.
 * @returns An object conforming to AxiosBaseQueryErrorResponse.
 */
function generateAxiosError(error: unknown): AxiosBaseQueryErrorResponse {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      return {
        status: error.response.status,
        data: {
          detail:
            error.response.data?.detail ||
            error.response.data?.message ||
            error.response.data?.error ||
            `Error ${error.response.status}: ${error.response.statusText}`,
          errors: error.response.data?.errors
        }
      };
    }
    if (error.request) {
      // The request was made but no response was received
      return {
        status: undefined,
        data: {
          detail:
            'No response from server. Please check your network connection.'
        }
      };
    }
    // Something happened in setting up the request
    return {
      status: undefined,
      data: {
        detail: error.message || 'An unknown Axios error occurred.'
      }
    };
  }
  // Handle non-Axios errors
  if (error instanceof Error) {
    return { status: undefined, data: { detail: error.message } };
  }
  // Fallback for unknown errors
  return {
    status: undefined,
    data: { detail: 'An unexpected error occurred.' }
  };
}

export interface UseQueryOptions {
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
  /** If true, the query will not run automatically. @default false */
  manual?: boolean;
  /** If true, the query will be skipped entirely. @default false */
  skip?: boolean;
}

// --- State and Reducer ---

interface State<T> {
  data: T | null;
  error: AxiosBaseQueryErrorResponse | null;
  isLoading: boolean;
  isSuccess: boolean;
}

type Action<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; payload: AxiosBaseQueryErrorResponse };

function fetchReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, isSuccess: false, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        data: action.payload
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        error: action.payload,
        data: null
      };
    default:
      throw new Error(`Unhandled action type in fetchReducer`);
  }
}

// --- useQuery Hook Implementation ---

export function useQuery<T>(
  url: string,
  options: UseQueryOptions = {}
): UseQueryResult<T> {
  const { params = {}, headers = {}, manual = false, skip = false } = options;

  const initialState: State<T> = {
    data: null,
    error: null,
    isLoading: !manual && !skip,
    isSuccess: false
  };

  const [state, dispatch] = useReducer(fetchReducer<T>, initialState);
  const isInitialMount = useRef(true);

  // Derive the isError flag from the state
  const isError = useMemo(() => state.error !== null, [state.error]);

  const refetch = useCallback(async (): Promise<
    [T | undefined, AxiosBaseQueryErrorResponse | undefined]
  > => {
    if (skip) {
      return [undefined, undefined];
    }
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axiosInstance.get<T>(url, { params, headers });
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      return [response.data, undefined];
    } catch (err) {
      const queryError = generateAxiosError(err);
      dispatch({ type: 'FETCH_ERROR', payload: queryError });
      return [undefined, queryError];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip, JSON.stringify(params), JSON.stringify(headers)]);

  useEffect(() => {
    // Only fetch on initial mount if not manual or skipped
    if (isInitialMount.current && !manual && !skip) {
      isInitialMount.current = false;
      refetch();
      return;
    }

    // After initial mount, refetch if dependencies change, but not if manual/skipped
    if (!isInitialMount.current && !manual && !skip) {
      refetch();
    }
  }, [manual, skip, refetch]);

  const result = useMemo(
    () => ({
      data: state.data,
      error: state.error,
      isLoading: state.isLoading,
      isSuccess: state.isSuccess,
      isError,
      refetch
    }),
    [
      state.data,
      state.error,
      state.isLoading,
      state.isSuccess,
      isError,
      refetch
    ]
  );

  return result as UseQueryResult<T>;
}
