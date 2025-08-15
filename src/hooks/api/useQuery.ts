import type { AxiosBaseQueryErrorResponse } from '@/utils/axiosInstance';
import axiosInstance from '@/utils/interceptors';
import axios, { type AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

// --- Shared Error Interface and Generator ---

interface UseQueryResult<T> {
  data: T | null;
  error: AxiosBaseQueryErrorResponse | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => Promise<
    [T | undefined, AxiosBaseQueryErrorResponse | undefined]
  >;
}

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

// --- Hook-Specific Type Definitions ---

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
    if (isInitialMount.current && !manual && !skip) {
      isInitialMount.current = false;
      refetch();
      return;
    }
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

  return result;
}
