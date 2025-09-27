import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import { useActiveManager } from '@/hooks/base/use-active-manager';
import { cn } from '@/lib/utils';
import { HelpCircle, Settings } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// --- Helper Data & Types ---
const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'] as const;
const ALL_NUMBERS = Array.from({ length: 75 }, (_, i) => i + 1);

interface PlayerCardData {
  id: string;
  grid: (string | number)[][];
}

const initialPlayerCards: readonly PlayerCardData[] = [
  {
    id: 'A1B2-C3D4',
    grid: [
      [3, 11, 5, 14, 9],
      [17, 28, 20, 25, 22],
      [33, 41, 'FREE', 38, 31],
      [48, 52, 58, 46, 55],
      [63, 71, 68, 75, 61]
    ]
  },
  {
    id: 'E5F6-G7H8',
    grid: [
      [8, 21, 35, 50, 61],
      [4, 19, 44, 59, 72],
      [12, 16, 'FREE', 47, 65],
      [2, 29, 31, 51, 69],
      [14, 25, 40, 53, 74]
    ]
  },
  {
    id: 'I9J0-K1L2',
    grid: [
      [1, 18, 32, 58, 64],
      [7, 23, 39, 54, 73],
      [10, 27, 'FREE', 49, 62],
      [13, 20, 43, 57, 70],
      [6, 26, 34, 56, 67]
    ]
  }
];
const initialCalledNumbers = new Set([3, 7, 41, 68, 22, 55, 1, 16, 34, 50, 70]);

// --- Sub-components ---
const ParticleBackground: React.FC = () => (
  <div className="particle-bg pointer-events-none">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="particle" />
    ))}
  </div>
);

const NumbersCalledBoard: React.FC<{ calledNumbers: Set<number> }> = ({
  calledNumbers
}) => (
  <div className="w-full rounded-xl bg-card p-3 border">
    <div className="flex justify-between items-baseline mb-3 px-1">
      <h2 className="text-lg font-bold">Numbers Called</h2>
      <span className="text-sm text-muted-foreground">
        {calledNumbers.size}/75
      </span>
    </div>
    <div className="grid grid-cols-15 gap-1.5 text-center text-xs">
      {ALL_NUMBERS.map((num) => {
        const isCalled = calledNumbers.has(num);
        return (
          <div
            key={num}
            className={cn(
              'w-full aspect-square rounded-full flex items-center justify-center transition-colors',
              isCalled
                ? 'border-2 border-primary neon-glow bg-primary/20'
                : 'bg-muted'
            )}>
            <span
              className={cn(
                isCalled
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground'
              )}>
              {num}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const PlayerCardGrid: React.FC<{
  cardGrid: (string | number)[][];
  calledNumbers: Set<number>;
}> = ({ cardGrid, calledNumbers }) => (
  <div className="grid grid-cols-5 gap-1.5 md:gap-2 text-center">
    {BINGO_LETTERS.map((letter) => (
      <div key={letter} className="font-bold text-lg md:text-xl text-primary">
        {letter}
      </div>
    ))}
    {cardGrid[0].map((_, colIndex) =>
      cardGrid.map((row, rowIndex) => {
        const number = cardGrid[rowIndex][colIndex];
        const isFreeSpace = number === 'FREE';
        const isCalled = isFreeSpace || calledNumbers.has(number as number);
        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              'w-full aspect-square rounded-md md:rounded-lg flex items-center justify-center transition-colors',
              isCalled
                ? 'bg-primary text-primary-foreground neon-glow'
                : 'bg-muted'
            )}>
            <span
              className={cn(
                'font-bold',
                isFreeSpace ? 'text-xs md:text-sm' : 'text-md md:text-lg'
              )}>
              {number}
            </span>
          </div>
        );
      })
    )}
  </div>
);

const CarouselDots: React.FC<{
  totalCount: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}> = ({ totalCount, activeIndex, onDotClick }) => (
  <div className="flex justify-center items-center gap-2 mt-4">
    {Array.from({ length: totalCount }).map((_, index) => (
      <button
        key={index}
        onClick={() => onDotClick(index)}
        className={cn(
          'h-2 rounded-full transition-all duration-300',
          index === activeIndex
            ? 'w-6 bg-primary'
            : 'w-2 bg-muted-foreground/50 hover:bg-muted-foreground'
        )}
        aria-label={`Go to card ${index + 1}`}
      />
    ))}
  </div>
);

// --- Main Component ---
export const PlayRound: React.FC = () => {
  const [calledNumbers] = useState(initialCalledNumbers);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const cardIds = useMemo(() => initialPlayerCards.map((c) => c.id), []);
  const { currentIndex, actions: cardActions } = useActiveManager(
    cardIds,
    cardIds[0]
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    if (currentIndex !== carouselApi.selectedScrollSnap()) {
      carouselApi.scrollTo(currentIndex);
    }
    const handleSelect = () => {
      const selectedIndex = carouselApi.selectedScrollSnap();
      if (selectedIndex !== currentIndex) {
        cardActions.set(cardIds[selectedIndex]);
      }
    };
    carouselApi.on('select', handleSelect);
    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi, currentIndex, cardActions, cardIds]);

  return (
    <div className="bg-background font-display text-foreground antialiased">
      <div className="relative flex flex-col min-h-screen">
        <ParticleBackground />

        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <div className="flex-1 flex justify-start">
              <div className="text-left">
                <h1 className="text-lg font-bold leading-tight">BINGO</h1>
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span>Live</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary rounded-full bingo-ball"></div>
                <span className="relative text-2xl font-bold text-primary-foreground">
                  B-7
                </span>
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

        {/* The main content area now has flex-1 to fill the remaining space */}
        <main className="container mx-auto px-4 py-6 z-10 flex-1">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-w-0">
            <div className="lg:flex-5 flex flex-col gap-6">
              <NumbersCalledBoard calledNumbers={calledNumbers} />
            </div>

            <div className="relative lg:flex-4 min-w-0 max-h-20">
              <div className="absolute -inset-2 -z-1 bg-card rounded-lg border border-muted-foreground"></div>
              <div className="flex justify-between items-baseline mb-3 px-1">
                <h2 className="text-lg font-bold">My Cards</h2>
                <span className="text-sm font-semibold text-muted-foreground">
                  Card {currentIndex + 1} of {initialPlayerCards.length}
                </span>
              </div>
              <Carousel
                setApi={setCarouselApi}
                opts={{ align: 'start' }}
                className="w-full">
                <CarouselContent>
                  {initialPlayerCards.map((card) => (
                    <CarouselItem key={card.id}>
                      <div className="p-1">
                        <div className="bg-card p-3 rounded-xl border">
                          <PlayerCardGrid
                            cardGrid={card.grid}
                            calledNumbers={calledNumbers}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />
              </Carousel>
              <CarouselDots
                totalCount={initialPlayerCards.length}
                activeIndex={currentIndex}
                onDotClick={(index) => carouselApi?.scrollTo(index)}
              />
            </div>
          </div>
        </main>

        <Button
          size="icon"
          className="fixed top-20 right-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground backdrop-blur-sm flex items-center justify-center neon-glow hover:bg-primary/90 transition-all">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
