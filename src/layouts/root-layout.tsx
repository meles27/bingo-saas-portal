import { ApiError } from '@/components/base/api-error';
import { Spinner } from '@/components/base/spinner';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/api/useQuery';
import { useConfigStore } from '@/store/configStore';
import type { AxiosBaseQueryErrorResponse } from '@/utils/axiosInstance';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

/**
 * This component is the root layout for the application. It uses the
 * `useJwtTokenExpiration` hook to check if the user is authenticated and
 * refreshes the token if it is close to expiration. If the token is
 * refreshed, then the user is directed to the dashboard. If the token is
 * invalid, then the user is directed to the login page.
 *
 * The component also uses the `useLocation` hook to get the current location
 * and dispatches actions to close the navbar and dashboard sidebar when the
 * location changes.
 *
 * The component renders an outlet component which is where the routes are
 * rendered. If the token is being refreshed, then it renders a spinner
 * component instead of the outlet.
 */
export const RootLayout: React.FC = () => {
  /**
   * totast time out
   */
  const TOAST_DEFAULT_TIMEOUT = useConfigStore(
    (state) => state.TOAST_DEFAULT_TIMEOUT
  );
  const retrieveTenantResponse = useQuery(urls.TENANT_SETTINGS);
  useEffect(() => {
    if (retrieveTenantResponse.isSuccess) {
      console.log('tenant; ', retrieveTenantResponse.data);
    }
  }, [retrieveTenantResponse.data, retrieveTenantResponse.isSuccess]);

  useEffect(() => {
    console.log(retrieveTenantResponse);
  }, [retrieveTenantResponse, retrieveTenantResponse.isSuccess]);

  return (
    <>
      {/* loading */}
      {retrieveTenantResponse.isLoading && <Spinner variant="screen" />}
      {/* error handler */}
      {retrieveTenantResponse.isError && (
        <ApiError
          error={retrieveTenantResponse.error as AxiosBaseQueryErrorResponse}
          size="large"
          resourceName="Product data"
          customAction={{
            label: 'Try Again',
            handler: retrieveTenantResponse.refetch
          }}
        />
      )}

      {/* success handler */}
      {retrieveTenantResponse.isSuccess && (
        <AnimatePresence>
          <Outlet key="root-layout-key" />
          <ToastContainer
            key="something-id"
            position="bottom-right"
            autoClose={TOAST_DEFAULT_TIMEOUT}
            hideProgressBar
            rtl={false}
            newestOnTop
            stacked
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="!z-[10000] mb-10"
          />
        </AnimatePresence>
      )}
    </>
  );
};
