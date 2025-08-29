import withAnimation from '@/components/base/route-animation/with-animation';
import { RoundList } from '@/components/tenant/game/game-round/round-list';
import { useParams } from 'react-router-dom';

export const RoundsPage = withAnimation(() => {
  const { gameId } = useParams();

  return (
    <>
      <RoundList gameId={gameId as string} />
    </>
  );
});
