import withAnimation from '@/components/base/route-animation/with-animation';
import { PlayRound } from '@/components/tenant/game/game-round/play-round';
import { useParams } from 'react-router-dom';

export const PlayRoundPage = withAnimation(() => {
  const { gameId } = useParams();
  return (
    <>
      <PlayRound />
    </>
  );
});
