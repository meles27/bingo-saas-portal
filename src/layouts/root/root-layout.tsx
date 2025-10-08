import { AuthManager } from '@/components/auth/auth-manager';
import { ApiError } from '@/components/base/api-error';
import { Spinner } from '@/components/base/spinner';
import { Toaster } from '@/components/ui/sonner';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import { initializeSocketConnection } from '@/lib/socket';
import { useConfigStore } from '@/store/config-store';
import type { TenantEntity } from '@/types/api/base/tenant.type';
import type { AxiosBaseQueryErrorResponse } from '@/utils/axiosInstance';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

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
  const setConfig = useConfigStore((state) => state.setConfig);

  const retrieveTenantResponse = useQuery<TenantEntity>(
    urls.getTenantSettingsUrl()
  );
  useEffect(() => {
    if (retrieveTenantResponse.isSuccess) {
      console.log('tenant; ', retrieveTenantResponse.data);
    }
  }, [retrieveTenantResponse.data, retrieveTenantResponse.isSuccess]);

  useEffect(() => {
    console.log(retrieveTenantResponse);
    if (retrieveTenantResponse.isSuccess) {
      setConfig('tenant', retrieveTenantResponse.data);
    }
  }, [retrieveTenantResponse, retrieveTenantResponse.isSuccess]);

  /**
   * Initialize socket connection
   */
  useEffect(() => {
    initializeSocketConnection();
  }, []);

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
          <Toaster
            richColors
            position="top-right"
            duration={TOAST_DEFAULT_TIMEOUT}
          />
          <AuthManager />
        </AnimatePresence>
      )}
    </>
  );
};
