import { globalAxiosInstance, tenantAxiosInstance } from '@/utils/interceptors';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

// --- Type Definitions (No Changes) ---

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

// --- Discriminated Union for Query Result (No Changes) ---

interface UseQueryBaseResult<T> {
  refetch: () => Promise<
    [T | undefined, AxiosBaseQueryErrorResponse | undefined]
  >;
}

interface UseQueryLoadingResult<T> extends UseQueryBaseResult<T> {
  data: T | null;
  error: null;
  isLoading: true;
  isSuccess: false;
  isError: false;
}

interface UseQuerySuccessResult<T> extends UseQueryBaseResult<T> {
  data: T;
  error: null;
  isLoading: false;
  isSuccess: true;
  isError: false;
}

interface UseQueryErrorResult<T> extends UseQueryBaseResult<T> {
  data: null;
  error: AxiosBaseQueryErrorResponse;
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

export type UseQueryResult<T> =
  | UseQueryLoadingResult<T>
  | UseQuerySuccessResult<T>
  | UseQueryErrorResult<T>
  | UseQueryIdleResult<T>;

// --- Error Generation Utility (No Changes) ---

function generateAxiosError(error: unknown): AxiosBaseQueryErrorResponse {
  if (axios.isAxiosError(error)) {
    if (error.response) {
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
      return {
        status: undefined,
        data: {
          detail:
            'No response from server. Please check your network connection.'
        }
      };
    }
    return {
      status: undefined,
      data: {
        detail: error.message || 'An unknown Axios error occurred.'
      }
    };
  }
  if (error instanceof Error) {
    return { status: undefined, data: { detail: error.message } };
  }
  return {
    status: undefined,
    data: { detail: 'An unexpected error occurred.' }
  };
}

// --- Options Interface ---

export interface UseQueryOptions {
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
  /** If true, the query will not run automatically. @default false */
  manual?: boolean;
  /** If true, the query will be skipped entirely. @default false */
  skip?: boolean;
  /**
   * Determines which API to target.
   * 'tenant' uses the subdomain-aware instance.
   * 'global' uses the main API instance.
   * @default 'tenant'
   */
  apiScope?: 'tenant' | 'global';
}

// --- State and Reducer (No Changes) ---

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
  const {
    params = {},
    headers = {},
    manual = false,
    skip = false,
    apiScope = 'tenant'
  } = options;

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

    const instance =
      apiScope === 'global' ? globalAxiosInstance : tenantAxiosInstance;

    try {
      const response = await instance.get<T>(url, { params, headers });
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      return [response.data, undefined];
    } catch (err) {
      const queryError = generateAxiosError(err);
      dispatch({ type: 'FETCH_ERROR', payload: queryError });
      return [undefined, queryError];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip, apiScope, JSON.stringify(params), JSON.stringify(headers)]);

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

  return result as UseQueryResult<T>;
}
