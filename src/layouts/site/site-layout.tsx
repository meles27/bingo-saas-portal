import { SiteHeader } from '@/components/site/site-header';
import { useAuthStore } from '@/store/auth-store';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const SiteLayout: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      {isAuthenticated() ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <div className="flex flex-col w-screen h-[100svh]">
          <SiteHeader />

          <div className="flex flex-1 overflow-auto">
            <AnimatePresence>
              <Outlet key={'site-layout-key'} />
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
};
