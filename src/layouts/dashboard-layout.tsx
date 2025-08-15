import AppHeader from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider
      className="relative flex flex-row h-screen w-screen"
      id="fslfsfojfosjoifsdifodf">
      {/* <section className="relative flex flex-row h-screen w-screen"> */}
      <AppSidebar className="max-w-[300px]" />
      <main className="flex flex-col w-full flex-1 md:w-[calc(100vw-300px)]">
        <AppHeader>
          <SidebarTrigger />
        </AppHeader>
        <div className="w-full h-full overflow-auto">
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
        </div>
      </main>
      {/* </section> */}
    </SidebarProvider>
  );
};
