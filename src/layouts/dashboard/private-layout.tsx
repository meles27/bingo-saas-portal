import { AppSidebar } from '@/components/app-sidebar';
import withAnimation from '@/components/base/route-animation/with-animation';
import { PrivateHeader } from '@/components/private-header';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateLayout: React.FC = withAnimation(() => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <>
      {isAuthenticated() ? (
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset className="overflow-hidden h-[100svh]">
            <div className="flex flex-col w-full h-full">
              {/* header section */}
              <PrivateHeader>
                <SidebarTrigger />
              </PrivateHeader>

              {/* main section */}
              <main className="flex-1 bg-background overflow-auto">
                <AnimatePresence>
                  <Outlet />
                </AnimatePresence>
              </main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
});
