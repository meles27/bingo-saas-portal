import { useConfigStore } from '@/store/configStore';
import type {
  AxiosBaseQueryErrorResponse,
  StandardValidationError
} from '@/utils/axiosInstance';
import { useEffect, useRef, type ReactNode } from 'react';
import { toast } from 'sonner';

// --- Enhanced Type Definitions ---

type SonnerToastContent = {
  title: ReactNode;
  description?: ReactNode;
};

type UseApiResponseToastOptions<TSuccessData = unknown> = {
  loadingMessage?: string;
  successMessage?: string;
  disableLoadingToast?: boolean;
  disableSuccessToast?: boolean;
  disableErrorToast?: boolean;
  errorCallback?: (error: AxiosBaseQueryErrorResponse) => void;
  successCallback?: (data?: TSuccessData) => void;

  errorAction?: {
    label: string;
    onClick: () => void;
  };
};

/**
 * Parses a custom API error and returns a structured object for a sonner toast.
 *
 * @param error - The custom API error object.
 * @param validationStatusCodes - An array of status codes to be treated as validation errors.
 * @returns An object with `title` and `description` for the toast.
 */
const parseErrorForSonner = (
  error: AxiosBaseQueryErrorResponse,
  validationStatusCodes: number[]
): SonnerToastContent => {
  const { status, data } = error;
  const genericErrorMessage = 'An unexpected error occurred.';

  const title = data?.detail || error.message || genericErrorMessage;

  // --- Specific Logic for 422 Validation Errors ---
  if (status === 422 && Array.isArray(data?.errors)) {
    const validationErrors = data.errors as StandardValidationError[];
    const description = (
      <ul className="list-disc list-inside space-y-1 text-sm">
        {validationErrors.map(({ field, messages }) => (
          <li key={field}>
            <strong className="capitalize">{field.replace(/_/g, ' ')}:</strong>{' '}
            {messages.join(', ')}
          </li>
        ))}
      </ul>
    );
    return { title: data.detail || 'Validation Failed', description };
  }

  // --- General Logic for Other "Validation-like" Errors ---
  if (status && validationStatusCodes.includes(status) && data?.errors) {
    const errors = data.errors;
    if (typeof errors === 'object' && !Array.isArray(errors)) {
      const description = (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {Object.entries(errors).map(([key, value]) => (
            <li key={key}>
              <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>{' '}
              {String(value)}
            </li>
          ))}
        </ul>
      );
      return { title, description };
    }
  }

  // --- Fallback for all other errors ---
  return { title };
};

/**
 * A hook to display loading, success, or error toasts based on an API call's state.
 * It intelligently transitions from a loading toast to a final state and parses
 * various API error formats for user-friendly display using `sonner`.
 *
 * @param state - The state from your query hook (e.g., from RTK Query or React Query).
 * @param options - Configuration for messages, callbacks, and disabling toasts.
 */
export const useApiResponseToast = <TSuccessData = unknown,>(
  state: {
    isLoading?: boolean;
    isFetching?: boolean;
    isError: boolean;
    isSuccess: boolean;
    error?: AxiosBaseQueryErrorResponse | null;
    data?: TSuccessData;
  },
  options: UseApiResponseToastOptions<TSuccessData> = {}
) => {
  const { isLoading, isFetching, isError, isSuccess, error, data } = state;
  const {
    loadingMessage = 'Processing your request...',
    successMessage = 'Operation successful!',
    disableLoadingToast = false,
    disableSuccessToast = false,
    disableErrorToast = false,
    errorCallback,
    successCallback,
    errorAction
  } = options;

  const STATUS_CODE_GROUP_VALIDATION = useConfigStore(
    (s) => s.STATUS_CODE_GROUP_VALIDATION
  );

  // Use a ref to keep track of the loading toast ID
  const loadingToastId = useRef<string | number | null>(null);

  // --- Effect for Loading State ---
  useEffect(() => {
    // Use isLoading or isFetching, preferring isLoading if both are provided
    const isCurrentlyLoading = isLoading ?? isFetching;

    if (isCurrentlyLoading && !disableLoadingToast) {
      // If a loading toast doesn't exist yet, create one
      if (loadingToastId.current === null) {
        loadingToastId.current = toast.loading(loadingMessage);
      }
    }
  }, [isLoading, isFetching, disableLoadingToast, loadingMessage]);

  // --- Effect for Error State ---
  useEffect(() => {
    if (isError && error) {
      // Execute the callback if provided
      errorCallback?.(error);
      if (disableErrorToast) return;

      const { title, description } = parseErrorForSonner(
        error,
        STATUS_CODE_GROUP_VALIDATION
      );

      // If a loading toast was active, update it. Otherwise, create a new error toast.
      toast.error(title, {
        id: loadingToastId.current ?? undefined,
        description,
        action: errorAction
      });

      // Clear the ref after handling the state
      loadingToastId.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, disableErrorToast, STATUS_CODE_GROUP_VALIDATION, errorAction]);

  // --- Effect for Success State ---
  useEffect(() => {
    if (isSuccess) {
      // Execute the callback if provided
      successCallback?.(data);
      if (disableSuccessToast) return;

      // If a loading toast was active, update it. Otherwise, create a new success toast.
      toast.success(successMessage, {
        id: loadingToastId.current ?? undefined
      });

      // Clear the ref after handling the state
      loadingToastId.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, disableSuccessToast, successMessage]);
};
