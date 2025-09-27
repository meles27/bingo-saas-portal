import withAnimation from '@/components/base/route-animation/with-animation';
import { GameList } from '@/components/tenant/game/game/game-list';

export const GameDetailPage = withAnimation(() => {
  return (
    <>
      <GameList />
    </>
  );
});
