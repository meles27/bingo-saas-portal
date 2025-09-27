import withAnimation from '@/components/base/route-animation/with-animation';
import {
  MobileNavigation,
  type MobileNavigationItem
} from '@/components/mobile-navigation';
import { useAuthStore } from '@/store/auth-store';
import { AnimatePresence } from 'framer-motion';
import { Gamepad2, Home, MoreVertical, Search, Wallet } from 'lucide-react';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const DashboardLayout: React.FC = withAnimation(() => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navItems: MobileNavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      onClick: () =>
        isAuthenticated() ? navigate('/dashboard') : navigate('/')
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      onClick: () => navigate('/dashboard/search')
    },
    {
      id: 'games',
      label: 'Games',
      icon: Gamepad2,
      onClick: () => navigate('/dashboard/games')
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      onClick: () => navigate('/dashboard/my-wallet')
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreVertical,
      onClick: () => navigate('/dashboard/more')
    }
  ];
  return (
    <div className="flex flex-col w-full h-full">
      {/* main section */}
      <main className="flex-1 bg-background overflow-auto">
        <AnimatePresence>
          <Outlet />
        </AnimatePresence>
      </main>

      {/* footer section */}
      <MobileNavigation items={navItems} />
    </div>
  );
});
