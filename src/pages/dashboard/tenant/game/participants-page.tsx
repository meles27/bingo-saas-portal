import withAnimation from '@/components/base/route-animation/with-animation';
import { useGameStore } from '@/store/game-store';
import { Navigate } from 'react-router-dom';

export const ParticipantsPage = withAnimation(() => {
  const gameId = useGameStore((state) => state.gameId);
  return (
    <>
      {gameId ? (
        <span>this is participants for game {gameId} page</span>
      ) : (
        <Navigate to="/dashboard/games" />
      )}
    </>
  );
});
