import withAnimation from '@/components/base/route-animation/with-animation';
import {
  MobileNavigation,
  type MobileNavigationItem
} from '@/components/mobile-navigation';
import { useAuthStore } from '@/store/auth-store';
import { useGameStore } from '@/store/game-store';
import { AnimatePresence } from 'framer-motion';
import { Dice2, Gamepad2, Home, MoreVertical, Play, User } from 'lucide-react';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const GameLayout: React.FC = withAnimation(() => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const gameId = useGameStore((state) => state.gameId);
  const roundId = useGameStore((state) => state.roundId);

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
      onClick: () => navigate('/dashboard/active-game/rounds')
    },
    {
      id: 'play',
      label: 'Play',
      icon: Play,
      onClick: () => navigate(`/dashboard/active-game/rounds/${roundId}/play`)
    },
    {
      id: 'my-cards',
      label: 'My-cards',
      icon: Dice2,
      onClick: () => navigate('/dashboard/active-game/my-cards')
    },
    {
      id: 'participants',
      label: 'Participants',
      icon: User,
      onClick: () => navigate('/dashboard/active-game/participants')
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreVertical,
      onClick: () => navigate('/dashboard/active-game/more')
    }
  ];

  useEffect(() => {
    if (!gameId) {
      toast.error('Select Game', {
        description: 'Please select a game to continue'
      });
    }
  }, [gameId]);

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
