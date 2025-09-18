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
import type {
  RoundDetailEntity,
  RoundStatus
} from '@/types/api/game/round.type';
import { Calendar, CheckCircle, Gift, Grid, Tag, XCircle } from 'lucide-react';
import React from 'react';
import { PatternVisualizer } from '../pattern/pattern-visualizer';

// --- Helper Components & Functions ---

const getRoundBadgeVariant = (status: RoundStatus) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'outline';
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
    <div className="flex items-center gap-2 w-[140px] shrink-0 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <div className="font-medium break-words">{children}</div>
  </div>
);

// --- Main Component ---

type RoundDetailProps = {
  roundId: string | null;
  gameId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const RoundDetail: React.FC<RoundDetailProps> = withAnimation(
  ({ gameId, roundId, open, onOpenChange }) => {
    const roundQuery = useQuery<RoundDetailEntity>(urls.getRoundUrl(roundId!), {
      skip: !roundId || !gameId || !open
    });

    const round = roundQuery.data;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col max-h-[95svh] overflow-auto p-0 sm:max-w-2xl">
          <DialogHeader className="sticky top-0 left-0 p-6  bg-background">
            <DialogTitle>
              Round {round?.roundNumber}: {round?.name || '...'}
            </DialogTitle>
            <DialogDescription>
              Detailed information for this game round.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col flex-1 p-6 gap-6">
            {roundQuery.isLoading && <Spinner variant="page" />}
            {roundQuery.isError && (
              <ApiError
                error={roundQuery.error}
                customAction={{ label: 'Retry', handler: roundQuery.refetch }}
              />
            )}
            {roundQuery.isSuccess && round && (
              <>
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow icon={<Tag className="h-4 w-4" />} label="Status">
                    <Badge
                      variant={getRoundBadgeVariant(round.status)}
                      className="capitalize">
                      {round.status}
                    </Badge>
                  </DetailRow>
                  <DetailRow icon={<Gift className="h-4 w-4" />} label="Prize">
                    {round.prize}
                  </DetailRow>
                </section>

                <Separator />

                <section className="space-y-4">
                  <h4 className="font-semibold">Schedule</h4>
                  <div className="space-y-3">
                    <DetailRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Starts At">
                      {formatDate(round.startedAt, { variant: 'dateTime' })}
                    </DetailRow>
                    <DetailRow
                      icon={<Calendar className="h-4 w-4" />}
                      label="Ends At">
                      {round.endedAt ? (
                        formatDate(round.endedAt, { variant: 'dateTime' })
                      ) : (
                        <span className="italic">In progress</span>
                      )}
                    </DetailRow>
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <h4 className="font-semibold">Grid Configuration</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow
                      icon={<Grid className="h-4 w-4" />}
                      label="Dimensions">
                      {round.rows} x {round.cols}
                    </DetailRow>
                    <DetailRow
                      icon={<Grid className="h-4 w-4" />}
                      label="Number Range">
                      {round.minRange} - {round.maxRange}
                    </DetailRow>
                    <DetailRow
                      icon={
                        round.freespaceEnabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )
                      }
                      label="Free Space">
                      {round.freespaceEnabled
                        ? `Yes (at ${round.freeRowPos}, ${round.freeColPos})`
                        : 'No'}
                    </DetailRow>
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <h4 className="font-semibold">
                    Winning Patterns ({round.patterns.length})
                  </h4>
                  <div className="flex flex-wrap gap-6">
                    {round.patterns.map((pattern) => (
                      <div key={pattern.id} className="space-y-2">
                        <p className="text-sm font-medium text-center">
                          {pattern.name}
                        </p>
                        <PatternVisualizer
                          coordinates={pattern.coordinates}
                          cellSize="h-4 w-4"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <h4 className="font-semibold">
                    Numbers Called ({round.calls.length})
                  </h4>
                  {round.calls.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {round.calls.map((call) => (
                        <Badge key={call.id} variant="secondary">
                          {call.numberCalled}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No numbers have been called yet.
                    </p>
                  )}
                </section>
              </>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 left-0 p-6 drop-shadow-xl shadow-red-500 bg-background m-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
