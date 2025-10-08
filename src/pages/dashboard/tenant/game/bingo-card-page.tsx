import withAnimation from '@/components/base/route-animation/with-animation';
import { BingoCardList } from '@/components/tenant/game/bingo-card/bingo-card-list';

export const BingoCardsPage = withAnimation(() => {
  return (
    <>
      <BingoCardList />
    </>
  );
});
