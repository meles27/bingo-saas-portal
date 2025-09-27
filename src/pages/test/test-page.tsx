import withAnimation from '@/components/base/route-animation/with-animation';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/game-store';

function GameComponent() {
  const { gameId, setGameId, clearGameId, updateGameId } = useGameStore();

  return (
    <div>
      <p>Current Game ID: {gameId ?? 'No Game'}</p>
      <Button onClick={() => setGameId('12345')}>Set Game</Button>
      <Button onClick={clearGameId}>Clear Game</Button>
      <Button
        onClick={() =>
          updateGameId((prev) => (prev ? prev + '-updated' : 'new-game'))
        }>
        Update Game
      </Button>
    </div>
  );
}

export default GameComponent;

export const TestPage = withAnimation(() => {
  return (
    <div>
      <GameComponent />
    </div>
  );
});
