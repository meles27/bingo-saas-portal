import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { ListBingoCardEntity } from '@/types/api/game/bingo-card';
import { BingoCardVisualizer } from './bingo-card-visualizer';

interface BingoCardProps {
  card: ListBingoCardEntity;
}

export const BingoCard = ({ card }: BingoCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base truncate">{card.name}</CardTitle>
        <CardDescription>{card.serial}</CardDescription>
      </CardHeader>
      <CardContent>
        <BingoCardVisualizer
          layout={card.layout}
          freespaceEnabled={card.freespaceEnabled}
        />
      </CardContent>
    </Card>
  );
};
