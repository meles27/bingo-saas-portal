import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { HelpCircle, Settings } from 'lucide-react';
import React, { useState } from 'react';

// --- Helper Data & Types ---
const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'] as const;
const ALL_NUMBERS = Array.from({ length: 75 }, (_, i) => i + 1);

// Mock data to represent the game state
const initialCardNumbers = [
  [3, 11, 5, 14, 9],
  [17, 28, 20, 25, 22],
  [33, 41, 'FREE', 38, 31],
  [48, 52, 58, 46, 55],
  [63, 71, 68, 75, 61]
];
const initialCalledNumbers = new Set([3, 7, 41, 68, 22, 55]);

// --- Sub-components ---

const ParticleBackground: React.FC = () => (
  <div className="particle-bg pointer-events-none">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="particle" />
    ))}
  </div>
);

const PlayerCard: React.FC<{
  card: (string | number)[][];
  calledNumbers: Set<number>;
}> = ({ card, calledNumbers }) => (
  <div className="px-4 pb-4">
    <div className="grid grid-cols-5 gap-2 text-center my-4">
      {BINGO_LETTERS.map((letter) => (
        <div key={letter} className="font-bold text-2xl text-primary">
          {letter}
        </div>
      ))}
      {card[0].map((_, colIndex) =>
        card.map((row, rowIndex) => {
          const number = card[rowIndex][colIndex];
          const isFreeSpace = number === 'FREE';
          const isCalled = isFreeSpace || calledNumbers.has(number as number);
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                'w-full aspect-square rounded-lg flex items-center justify-center',
                isCalled ? 'bg-primary neon-glow' : 'bg-muted' // Replaced bg-white/10
              )}>
              <span
                className={cn(
                  'font-bold',
                  isFreeSpace ? 'text-base' : 'text-xl'
                )}>
                {number}
              </span>
            </div>
          );
        })
      )}
    </div>
  </div>
);

// --- Main Component ---

export const PlayRound: React.FC = () => {
  const [calledNumbers] = useState(initialCalledNumbers);
  const [playerCard] = useState(initialCardNumbers);

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const totalCalled = calledNumbers.size;
  const progress = (totalCalled / 75) * 100;

  const gameContent = (
    <>
      <p className="text-sm text-muted-foreground">Round 1</p>
      <div className="my-8 flex items-center justify-center">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary rounded-full bingo-ball"></div>
          <span className="relative text-7xl font-bold">B-7</span>
        </div>
      </div>
      <div className="w-full max-w-md">
        <div className="flex justify-between items-baseline mb-2">
          <h2 className="text-lg font-bold">Numbers Called</h2>
          <span className="text-sm text-muted-foreground">
            {totalCalled}/75
          </span>
        </div>
        <div className="grid grid-cols-15 gap-1.5 text-center text-xs">
          {ALL_NUMBERS.map((num) => {
            const isCalled = calledNumbers.has(num);
            return (
              <div
                key={num}
                className={cn(
                  'w-full aspect-square rounded-full flex items-center justify-center',
                  isCalled
                    ? 'border-2 border-primary neon-glow bg-primary/20'
                    : 'bg-muted' // Replaced bg-white/5
                )}>
                <span
                  className={cn(
                    isCalled ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                  {num}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-background font-display text-foreground antialiased">
      <div className="relative min-h-screen flex flex-col">
        <ParticleBackground />

        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold">BINGO</h1>
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>Live</span>
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full hover:bg-accent">
                <Settings />
              </Button>
            </div>
          </div>
        </header>

        {isDesktop ? (
          <>
            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center z-10">
              {gameContent}
            </main>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="fixed bottom-0 left-0 right-0 z-30 cursor-pointer">
                  <div className="bg-background/70 backdrop-blur-xl border-t rounded-t-xl h-20 flex flex-col items-center pt-2">
                    <div className="w-10 h-1.5 bg-accent rounded-full"></div>
                    <h2 className="text-xl font-bold mt-2">My Card</h2>
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent className="bg-background/80 backdrop-blur-xl border-t text-foreground max-h-[80vh]">
                <PlayerCard card={playerCard} calledNumbers={calledNumbers} />
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center z-10">
            {gameContent}
            <div className="w-full max-w-md mt-8">
              <h2 className="text-xl font-bold mb-2">My Card</h2>
              <div className="bg-muted rounded-xl border">
                <PlayerCard card={playerCard} calledNumbers={calledNumbers} />
              </div>
            </div>
          </main>
        )}

        <Button
          size="icon"
          className="fixed top-20 right-4 z-40 w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center neon-glow hover:bg-primary transition-all">
          <HelpCircle className="text-primary-foreground h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
