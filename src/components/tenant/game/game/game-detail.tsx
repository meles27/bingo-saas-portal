import { ApiError } from '@/components/base/api-error';
import withAnimation from '@/components/base/route-animation/with-animation';
import { Spinner } from '@/components/base/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import { formatDate } from '@/lib/utils';
import type { GameDetailEntity, GameStatus } from '@/types/api/game/game.type';
import type { RoundStatus } from '@/types/api/game/round.type';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Calendar, Repeat, Tag, Ticket, X } from 'lucide-react';
import React from 'react';

// --- Helper Components & Functions ---

const getGameBadgeVariant = (status: GameStatus) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'outline'; // Changed to 'success' for better visual cue
    case 'cancelled':
      return 'destructive';
    case 'pending':
    default:
      return 'secondary';
  }
};

const getRoundBadgeVariant = (status: RoundStatus) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'outline'; // Changed to 'success'
    case 'pending':
    default:
      return 'secondary';
  }
};

const DetailRow = ({
  icon,
  label,
  children
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start text-sm">
    <div className="flex items-center gap-2 w-[120px] shrink-0 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <div className="font-medium break-words">{children}</div>
  </div>
);

// --- Main Component ---

type GameDetailProps = {
  gameId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const GameDetail: React.FC<GameDetailProps> = withAnimation(
  ({ gameId, open, onOpenChange }) => {
    const gameQuery = useQuery<GameDetailEntity>(urls.getGameUrl(gameId!), {
      skip: !gameId || !open
    });

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-2xl max-h-[95dvh] overflow-auto bg-white py-0">
          <DialogHeader className="sticky top-0 left-0 bg-inherit py-6">
            <DialogTrigger className="absolute top-6 right-0">
              <X className="hover:text-red-500 hover:scale-105 active:scale-95 transform" />
            </DialogTrigger>
            <DialogTitle>Game Details</DialogTitle>
            <DialogDescription>
              Viewing detailed information for game:
              {gameQuery.data?.name || '...'}
            </DialogDescription>
          </DialogHeader>

          <div className=" p-4 space-y-6">
            {/* loading state */}
            {gameQuery.isLoading && <Spinner variant="page" />}

            {/* error state */}
            {gameQuery.isError && (
              <ApiError
                error={gameQuery.error}
                customAction={{ label: 'Retry', handler: gameQuery.refetch }}
              />
            )}

            {/* success state */}
            {gameQuery.isSuccess && (
              <>
                <section className="space-y-4">
                  <h4 className="font-semibold">Session Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow
                      icon={<Tag className="h-4 w-4" />}
                      label="Status">
                      <Badge
                        variant={getGameBadgeVariant(gameQuery.data.status)}
                        className="capitalize">
                        {gameQuery.data.status}
                      </Badge>
                    </DetailRow>
                    <DetailRow
                      icon={<Repeat className="h-4 w-4" />}
                      label="Total Rounds">
                      {gameQuery.data.totalRounds}
                    </DetailRow>
                    <DetailRow
                      icon={<Ticket className="h-4 w-4" />}
                      label="Entry Fee">
                      {gameQuery.data.entryFee} {gameQuery.data.currency}
                    </DetailRow>
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <h4 className="font-semibold">Schedule</h4>
                  <div className="space-y-3">
                    <DetailRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Starts At">
                      {formatDate(gameQuery.data.startedAt, {
                        variant: 'dateTime'
                      })}
                    </DetailRow>
                    <DetailRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Ends At">
                      {formatDate(gameQuery.data.endedAt, {
                        variant: 'dateTime'
                      })}
                    </DetailRow>
                  </div>
                </section>

                {gameQuery.data.description && (
                  <>
                    <Separator />
                    <section className="space-y-2">
                      <h4 className="font-semibold">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {gameQuery.data.description}
                      </p>
                    </section>
                  </>
                )}

                <Separator />

                <section className="space-y-4">
                  <h4 className="font-semibold">
                    Rounds ({gameQuery.data.rounds.length})
                  </h4>
                  {gameQuery.data.rounds.length > 0 ? (
                    <div className="space-y-3">
                      {gameQuery.data.rounds
                        .sort(
                          (prev, next) => prev.roundNumber - next.roundNumber
                        )
                        .map((round) => (
                          <div
                            key={round.id}
                            className="p-3 border rounded-md flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <p className="font-medium">
                                Round {round.roundNumber}: {round.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Prize: {round.prize}
                              </p>
                              {/* --- ADDED THIS BLOCK --- */}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Starts:{' '}
                                  {formatDate(round.startedAt, {
                                    variant: 'dateTime'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Ends:{' '}
                                  {round.endedAt ? (
                                    formatDate(round.endedAt, {
                                      variant: 'dateTime'
                                    })
                                  ) : (
                                    <span className="italic">Not ended</span>
                                  )}
                                </span>
                              </div>
                              {/* --- END ADDED BLOCK --- */}
                            </div>
                            <Badge
                              variant={getRoundBadgeVariant(round.status)}
                              className="capitalize w-min mt-1">
                              {round.status}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No rounds have been added to this game yet.
                    </p>
                  )}
                </section>
              </>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 left-0 bg-inherit py-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
