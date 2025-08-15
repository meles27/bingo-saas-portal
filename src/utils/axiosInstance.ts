import { type BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, type AxiosRequestConfig } from 'axios';
import axiosInstance from './interceptors';

// Structure for the specific 422 validation error item
export type StandardValidationError = {
  field: string;
  messages: string[];
};

// Shape of the API error data payload (flexible)
type ApiErrorData = {
  detail?: string;
  // `errors` can be an array of objects, a plain object, a string, or an array of strings
  errors?:
    | StandardValidationError[]
    | Record<string, unknown>
    | string
    | string[];
};

export interface AxiosBaseQueryErrorResponse {
  status?: number;
  data: ApiErrorData;
  message?: string;
}

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance.request({
        url: url,
        baseURL: baseUrl,
        method,
        data,
        params,
        headers
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || { detail: err.message },
          message: err.message
        } as AxiosBaseQueryErrorResponse
      };
    }
  };

export default axiosBaseQuery;
