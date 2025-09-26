import { AppSidebar } from '@/components/app-sidebar';
import withAnimation from '@/components/base/route-animation/with-animation';
import DashboardHeader from '@/components/dashboard-header';
import {
  MobileNavigation,
  type MobileNavigationItem
} from '@/components/mobile-navigation';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AnimatePresence } from 'framer-motion';
import { Gamepad2, Home, User } from 'lucide-react';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const DashboardLayout: React.FC = withAnimation(() => {
  const navigate = useNavigate();

  const navItems: MobileNavigationItem[] = [
    { id: 'home', label: 'Home', icon: Home, onClick: () => navigate('/') },
    {
      id: 'lobby',
      label: 'Lobby',
      icon: Gamepad2,
      onClick: () => navigate('/lobby')
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      onClick: () => navigate('/profile')
    }
  ];
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden h-[100svh]">
        <div className="flex flex-col w-full h-full">
          {/* header section */}
          <DashboardHeader>
            <SidebarTrigger />
          </DashboardHeader>

          {/* main section */}
          <main className="flex-1 bg-background overflow-auto">
            <AnimatePresence>
              <Outlet />
            </AnimatePresence>
          </main>

          {/* footer section */}
          <MobileNavigation items={navItems} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
});
