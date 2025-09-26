import { AppSidebar } from '@/components/app-sidebar';
import withAnimation from '@/components/base/route-animation/with-animation';
import { Separator } from '@/components/ui/separator';
// import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const DashboardLayout: React.FC = withAnimation(() => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden h-[100svh]">
        <div className="flex flex-col w-full h-full">
          <header className="border-b border-border sticky top-0 bg-background z-10">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
            </div>
          </header>

          <main className="flex-1 bg-background overflow-auto">
            <AnimatePresence>
              <Outlet />
            </AnimatePresence>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
});
