import withAnimation from '@/components/base/route-animation/with-animation';
import { PatternList } from '@/components/tenant/game/pattern/pattern-list';

export const PatternsPage = withAnimation(() => {
  return (
    <>
      <PatternList />
    </>
  );
});
