// import type { AxiosBaseQueryErrorResponse } from '@/utils/axiosInstance';
// import axiosInstance from '@/utils/interceptors';
// import axios, { type AxiosRequestConfig, type Method } from 'axios';
// import { useCallback, useMemo, useReducer } from 'react';

// /**
//  * Generates a structured error object from various error types.
//  * @param error The error caught in a catch block.
//  * @returns An object conforming to AxiosBaseQueryErrorResponse.
//  */
// function generateQueryError(error: unknown): AxiosBaseQueryErrorResponse {
//   if (axios.isAxiosError(error)) {
//     if (error.response) {
//       // The server responded with a status code outside the 2xx range
//       return {
//         status: error.response.status,
//         data: {
//           detail:
//             error.response.data?.detail ||
//             error.response.data?.message ||
//             error.response.data?.error ||
//             `Error ${error.response.status}: ${error.response.statusText}`,
//           errors: error.response.data?.errors
//         }
//       };
//     }
//     if (error.request) {
//       // The request was made but no response was received
//       return {
//         status: undefined,
//         data: {
//           detail:
//             'No response from server. Please check your network connection.'
//         }
//       };
//     }
//     // Something happened in setting up the request
//     return {
//       status: undefined,
//       data: {
//         detail: error.message || 'An unknown Axios error occurred.'
//       }
//     };
//   }
//   // Handle non-Axios errors
//   if (error instanceof Error) {
//     return { status: undefined, data: { detail: error.message } };
//   }
//   // Fallback for unknown errors
//   return {
//     status: undefined,
//     data: { detail: 'An unexpected error occurred.' }
//   };
// }

// // --- Hook-Specific Type Definitions ---

// export interface UseMutationOptions {
//   headers?: AxiosRequestConfig['headers'];
//   params?: AxiosRequestConfig['params'];
// }

// export interface ExecuteOptions {
//   url?: string;
//   headers?: AxiosRequestConfig['headers'];
//   params?: AxiosRequestConfig['params'];
// }

// // --- State and Reducer ---

// interface State<T> {
//   data: T | null;
//   error: AxiosBaseQueryErrorResponse | null;
//   isLoading: boolean;
//   isSuccess: boolean;
// }

// type Action<T> =
//   | { type: 'MUTATE_START' }
//   | { type: 'MUTATE_SUCCESS'; payload: T }
//   | { type: 'MUTATE_ERROR'; payload: AxiosBaseQueryErrorResponse };

// function mutationReducer<T>(state: State<T>, action: Action<T>): State<T> {
//   switch (action.type) {
//     case 'MUTATE_START':
//       return { data: null, isLoading: true, isSuccess: false, error: null };
//     case 'MUTATE_SUCCESS':
//       return {
//         ...state,
//         isLoading: false,
//         isSuccess: true,
//         data: action.payload
//       };
//     case 'MUTATE_ERROR':
//       return {
//         ...state,
//         isLoading: false,
//         isSuccess: false,
//         error: action.payload
//       };
//     default:
//       throw new Error(`Unhandled action type in mutationReducer`);
//   }
// }

// // --- React Custom Hook: useMutation ---

// export function useMutation<TResponse, TBody = unknown>(
//   defaultUrl: string,
//   method: Method,
//   defaultOptions: UseMutationOptions = {}
// ) {
//   const initialState: State<TResponse> = {
//     data: null,
//     error: null,
//     isLoading: false,
//     isSuccess: false
//   };

//   const [state, dispatchState] = useReducer(
//     mutationReducer<TResponse>,
//     initialState
//   );
//   const isError = useMemo(() => state.error !== null, [state.error]);

//   const execute = useCallback(
//     async (
//       body?: TBody | null,
//       executeOptions: ExecuteOptions = {}
//     ): Promise<
//       [TResponse | undefined, AxiosBaseQueryErrorResponse | undefined]
//     > => {
//       dispatchState({ type: 'MUTATE_START' });
//       const finalUrl = executeOptions.url ?? defaultUrl;
//       try {
//         const response = await axiosInstance.request<TResponse>({
//           url: finalUrl,
//           method,
//           data: body,
//           headers: { ...defaultOptions.headers, ...executeOptions.headers },
//           params: { ...defaultOptions.params, ...executeOptions.params }
//         });
//         dispatchState({ type: 'MUTATE_SUCCESS', payload: response.data });
//         return [response.data, undefined];
//       } catch (err) {
//         console.log(err);
//         const queryError = generateQueryError(err);
//         dispatchState({ type: 'MUTATE_ERROR', payload: queryError });
//         return [undefined, queryError];
//       }
//     },
//     [defaultUrl, method, defaultOptions]
//   );

//   return {
//     ...state,
//     isError,
//     execute
//   };
// }

import axiosInstance from '@/utils/interceptors';
import type { AxiosRequestConfig, Method } from 'axios';
import axios from 'axios';
import { useCallback, useMemo, useReducer } from 'react';

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

// --- NEW: Discriminated Union for Mutation Result ---

interface UseMutationBaseResult<TResponse, TBody> {
  /**
   * Executes the mutation.
   * @param body The request body for the mutation.
   * @param executeOptions Overrides for the mutation's URL, headers, or params.
   * @returns A promise that resolves with a [data, error] tuple.
   */
  execute: (
    body?: TBody | null,
    executeOptions?: ExecuteOptions
  ) => Promise<
    [TResponse | undefined, AxiosBaseQueryErrorResponse | undefined]
  >;
}

interface UseMutationLoadingResult<TResponse, TBody>
  extends UseMutationBaseResult<TResponse, TBody> {
  data: null;
  error: null;
  isLoading: true;
  isSuccess: false;
  isError: false;
}

interface UseMutationSuccessResult<TResponse, TBody>
  extends UseMutationBaseResult<TResponse, TBody> {
  data: TResponse; // Data is guaranteed to be present
  error: null;
  isLoading: false;
  isSuccess: true;
  isError: false;
}

interface UseMutationErrorResult<TResponse, TBody>
  extends UseMutationBaseResult<TResponse, TBody> {
  data: null;
  error: AxiosBaseQueryErrorResponse; // Error is guaranteed to be present
  isLoading: false;
  isSuccess: false;
  isError: true;
}

interface UseMutationIdleResult<TResponse, TBody>
  extends UseMutationBaseResult<TResponse, TBody> {
  data: null;
  error: null;
  isLoading: false;
  isSuccess: false;
  isError: false;
}

/**
 * The result of the useMutation hook, discriminated by state flags.
 * This allows for type-safe access to `data` and `error`.
 */
export type UseMutationResult<TResponse, TBody> =
  | UseMutationLoadingResult<TResponse, TBody>
  | UseMutationSuccessResult<TResponse, TBody>
  | UseMutationErrorResult<TResponse, TBody>
  | UseMutationIdleResult<TResponse, TBody>;

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
        isLoading: false,
        isSuccess: true,
        data: action.payload,
        error: null
      };
    case 'MUTATE_ERROR':
      return {
        isLoading: false,
        isSuccess: false,
        error: action.payload,
        data: null // Explicitly set data to null on error
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
): UseMutationResult<TResponse, TBody> {
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
        const queryError = generateQueryError(err);
        dispatchState({ type: 'MUTATE_ERROR', payload: queryError });
        return [undefined, queryError];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultUrl, method, JSON.stringify(defaultOptions)]
  );

  const result = {
    ...state,
    isError,
    execute
  };

  // The reducer logic ensures the state properties are consistent,
  // so we can safely cast the result to our discriminated union type.
  return result as UseMutationResult<TResponse, TBody>;
}
