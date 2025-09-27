import withAnimation from '@/components/base/route-animation/with-animation';
import { useParams } from 'react-router-dom';

export const ParticipantsPage = withAnimation(() => {
  const { gameId } = useParams();
  return <>this is participants for game {gameId} page</>;
});
