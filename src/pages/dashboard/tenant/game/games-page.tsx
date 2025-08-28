import withAnimation from '@/components/base/route-animation/with-animation';
import { GameList } from '@/components/tenant/game/game/game-list';

export const GamesPage = withAnimation(() => {
  return (
    <>
      <GameList />
    </>
  );
});
