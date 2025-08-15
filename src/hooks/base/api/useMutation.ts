import type { AxiosBaseQueryErrorResponse } from '@/utils/axiosInstance';
import axiosInstance from '@/utils/interceptors';
import axios, { type AxiosRequestConfig, type Method } from 'axios';
import { useCallback, useMemo, useReducer } from 'react';

/**
 * Generates a structured error object from various error types.
 * @param error The error caught in a catch block.
 * @returns An object conforming to AxiosBaseQueryErrorResponse.
 */
function generateQueryError(error: unknown): AxiosBaseQueryErrorResponse {
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

export interface UseMutationOptions {
  headers?: AxiosRequestConfig['headers'];
  params?: AxiosRequestConfig['params'];
}

export interface ExecuteOptions {
  url?: string;
  headers?: AxiosRequestConfig['headers'];
  params?: AxiosRequestConfig['params'];
}

// --- State and Reducer ---

interface State<T> {
  data: T | null;
  error: AxiosBaseQueryErrorResponse | null;
  isLoading: boolean;
  isSuccess: boolean;
}

type Action<T> =
  | { type: 'MUTATE_START' }
  | { type: 'MUTATE_SUCCESS'; payload: T }
  | { type: 'MUTATE_ERROR'; payload: AxiosBaseQueryErrorResponse };

function mutationReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'MUTATE_START':
      return { data: null, isLoading: true, isSuccess: false, error: null };
    case 'MUTATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        data: action.payload
      };
    case 'MUTATE_ERROR':
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        error: action.payload
      };
    default:
      throw new Error(`Unhandled action type in mutationReducer`);
  }
}

// --- React Custom Hook: useMutation ---

export function useMutation<TResponse, TBody = unknown>(
  defaultUrl: string,
  method: Method,
  defaultOptions: UseMutationOptions = {}
) {
  const initialState: State<TResponse> = {
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false
  };

  const [state, dispatchState] = useReducer(
    mutationReducer<TResponse>,
    initialState
  );
  const isError = useMemo(() => state.error !== null, [state.error]);

  const execute = useCallback(
    async (
      body?: TBody | null,
      executeOptions: ExecuteOptions = {}
    ): Promise<
      [TResponse | undefined, AxiosBaseQueryErrorResponse | undefined]
    > => {
      dispatchState({ type: 'MUTATE_START' });
      const finalUrl = executeOptions.url ?? defaultUrl;
      try {
        const response = await axiosInstance.request<TResponse>({
          url: finalUrl,
          method,
          data: body,
          headers: { ...defaultOptions.headers, ...executeOptions.headers },
          params: { ...defaultOptions.params, ...executeOptions.params }
        });
        dispatchState({ type: 'MUTATE_SUCCESS', payload: response.data });
        return [response.data, undefined];
      } catch (err) {
        console.log(err);
        const queryError = generateQueryError(err);
        dispatchState({ type: 'MUTATE_ERROR', payload: queryError });
        return [undefined, queryError];
      }
    },
    [defaultUrl, method, defaultOptions]
  );

  return {
    ...state,
    isError,
    execute
  };
}
