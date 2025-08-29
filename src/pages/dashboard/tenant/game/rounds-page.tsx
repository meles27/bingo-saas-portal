import withAnimation from '@/components/base/route-animation/with-animation';
import { RoundList } from '@/components/tenant/game/game-round/round-list';
import { useSearchParams } from 'react-router-dom';

export const RoundsPage = withAnimation(() => {
  const [searchParams] = useSearchParams();
  return (
    <>
      <RoundList gameId={searchParams.get('gameId') || ''} />
    </>
  );
});
