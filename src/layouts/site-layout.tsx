import { MobileNavigation } from '@/components/mobile-navigation';
import { SiteHeader } from '@/components/site/site-header';
import { useAuthStore } from '@/store/authStore';
import { AnimatePresence } from 'framer-motion';
import { Gamepad2, Home, User } from 'lucide-react';
import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export const SiteLayout: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navItems = [
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
          <MobileNavigation items={navItems} />
        </div>
      )}
    </>
  );
};
