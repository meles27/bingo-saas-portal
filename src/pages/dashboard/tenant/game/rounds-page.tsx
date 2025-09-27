import withAnimation from '@/components/base/route-animation/with-animation';
import { RoundList } from '@/components/tenant/game/game-round/round-list';
import { useGameStore } from '@/store/game-store';
import { Navigate } from 'react-router-dom';

export const RoundsPage = withAnimation(() => {
  const gameId = useGameStore((state) => state.gameId);
  return (
    <>
      {gameId ? (
        <RoundList gameId={gameId} />
      ) : (
        <Navigate to="/dashboard/games" />
      )}
    </>
  );
});
