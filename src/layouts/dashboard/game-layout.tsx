import withAnimation from '@/components/base/route-animation/with-animation';
import { useAuthStore } from '@/store/auth-store';
import { useGameStore } from '@/store/game-store';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const GameLayout: React.FC = withAnimation(() => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const gameId = useGameStore((state) => state.gameId);
  const roundId = useGameStore((state) => state.roundId);

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
        </div>
      ) : (
        <Navigate to="/dashboard/games" />
      )}
    </>
  );
});
