import withAnimation from '@/components/base/route-animation/with-animation';
import {
  MobileNavigation,
  type MobileNavigationItem
} from '@/components/mobile-navigation';
import { useAuthStore } from '@/store/auth-store';
import { AnimatePresence } from 'framer-motion';
import { Gamepad2, Home, MoreVertical, User } from 'lucide-react';
import React from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

export const GameLayout: React.FC = withAnimation(() => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { gameId } = useParams();

  const navItems: MobileNavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      onClick: () =>
        isAuthenticated() ? navigate('/dashboard') : navigate('/')
    },
    {
      id: 'rounds',
      label: 'Rounds',
      icon: Gamepad2,
      onClick: () => navigate(`/dashboard/games/${gameId}/rounds`)
    },
    {
      id: 'participants',
      label: 'Participants',
      icon: User,
      onClick: () => navigate(`/dashboard/games/${gameId}/participants`)
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreVertical,
      onClick: () => navigate(`/dashboard/games/${gameId}/more`)
    }
  ];
  return (
    <>
      {gameId ? (
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
      ) : (
        <Navigate to="/dashboard/games" />
      )}
    </>
  );
});
