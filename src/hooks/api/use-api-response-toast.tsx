import { useConfigStore } from '@/store/configStore';
import type {
  AxiosBaseQueryErrorResponse,
  StandardValidationError
} from '@/utils/axiosInstance';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

// --- Type Definitions for Clarity ---

type UseApiResponseToastOptions<TSuccessData = unknown> = {
  successMessage?: string;
  disableSuccessToast?: boolean;
  disableErrorToast?: boolean;
  errorCallback?: (error: AxiosBaseQueryErrorResponse) => void;
  successCallback?: (data?: TSuccessData) => void;
};

/**
 * Parses a custom API error and returns a user-friendly ReactNode for toasting.
 *
 * @param error - The custom API error object.
 * @param validationStatusCodes - An array of status codes to be treated as validation errors.
 * @returns A ReactNode to be displayed in a toast.
 */
const parseErrorToToastContent = (
  error: AxiosBaseQueryErrorResponse,
  validationStatusCodes: number[]
): React.ReactNode => {
  const { status, data } = error;
  const genericErrorMessage = 'An unexpected error occurred.';

  // Start with the most specific message available
  const mainMessage = data?.detail || error.message || genericErrorMessage;

  // --- Specific Logic for 422 Validation Errors ---
  if (status === 422 && Array.isArray(data?.errors)) {
    // We assume it matches the standard format for 422 errors
    const validationErrors = data.errors as Array<StandardValidationError>;
    const title = data.detail || 'Validation Failed';

    return (
      <div>
        <p className="font-semibold mb-2">{title}</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {validationErrors.map(({ field, messages }) => (
            <li key={field}>
              <strong className="capitalize">
                {field.replace(/_/g, ' ')}:
              </strong>{' '}
              {messages.join(', ')}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // --- General Logic for Other "Validation-like" Errors (400, 409, etc.) ---
  if (status && validationStatusCodes.includes(status) && data?.errors) {
    const errors = data.errors;
    // Handle case where `errors` is a plain object (e.g., { email: "Already exists." })
    if (typeof errors === 'object' && !Array.isArray(errors)) {
      return (
        <div>
          <p className="font-semibold mb-2">{mainMessage}</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>
                <strong className="capitalize">
                  {key.replace(/_/g, ' ')}:
                </strong>{' '}
                {String(value)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }

  // --- Fallback for all other errors (401, 403, 404, 500) ---
  // Just show the primary detail message.
  return mainMessage;
};

/**
 * A hook to display success or error toasts based on the state from a custom hook.
 * It intelligently parses various API error formats for user-friendly display.
 *
 * @param state - An object containing the state variables from your custom hook.
 * @param options - Configuration for messages, callbacks, and disabling toasts.
 */
export const useApiResponseToast = <TSuccessData = unknown,>(
  state: {
    error: AxiosBaseQueryErrorResponse | null | undefined;
    isError: boolean;
    isSuccess: boolean;
    data?: TSuccessData; // The success data from your custom function
  },
  options: UseApiResponseToastOptions<TSuccessData> = {}
) => {
  const { error, isError, isSuccess, data } = state;
  const {
    successMessage = 'Operation successful!',
    disableSuccessToast = false,
    disableErrorToast = false,
    errorCallback,
    successCallback
  } = options;

  const STATUS_CODE_GROUP_VALIDATION = useConfigStore(
    (state) => state.STATUS_CODE_GROUP_VALIDATION
  );

  // Effect for handling and displaying errors
  useEffect(() => {
    if (isError && error) {
      if (errorCallback) {
        setTimeout(() => errorCallback(error), 0);
      }
      if (disableErrorToast) return;

      const toastContent = parseErrorToToastContent(
        error,
        STATUS_CODE_GROUP_VALIDATION
      );
      toast.error(toastContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, disableErrorToast, STATUS_CODE_GROUP_VALIDATION]);

  // Effect for handling and displaying success
  useEffect(() => {
    if (isSuccess) {
      if (successCallback) {
        setTimeout(() => successCallback(data), 0);
      }
      if (disableSuccessToast) return;

      toast.success(successMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, disableSuccessToast, successMessage]);
};
