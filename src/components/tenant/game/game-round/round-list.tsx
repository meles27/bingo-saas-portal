import { ActionMenu, ActionMenuItem } from '@/components/base/action-menu';
import { ApiError } from '@/components/base/api-error';
import {
  CustomPagination,
  type CustomPaginationRefIFace
} from '@/components/base/custom-pagination';
import { EmptyList } from '@/components/base/empty-list';
import withAnimation from '@/components/base/route-animation/with-animation';
import { SearchInput } from '@/components/base/search-input';
import { Spinner } from '@/components/base/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import { useVisibilityManager } from '@/hooks/base/use-visibility-control';
import { formatDate } from '@/lib/utils';
import { useConfigStore } from '@/store/config-store';
import type { PaginatedResponse } from '@/types/api/base';
import type {
  RoundListEntity,
  RoundQueryParamsIface,
  RoundStatus
} from '@/types/api/game/round.type';
import { Calendar, Eye, Gift, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRound } from './create-round';
import { DestroyRound } from './destroy-round';
import { RoundDetail } from './round-detail';
// import { CreateRound } from './create-round';
// import { DestroyRound } from './destroy-round';
// import { RoundDetail } from './round-detail';
// import { UpdateRound } from './update-round';

type ActionType = 'detail' | 'update' | 'delete' | 'create';

/**
 * Helper to determine badge color based on round status.
 */
const getBadgeVariant = (status: RoundStatus) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'default';
    case 'pending':
    default:
      return 'secondary';
  }
};

/**
 * A dedicated card component to display round information.
 */
const RoundCard = ({
  round,
  onAction
}: {
  round: RoundListEntity;
  onAction: (name: ActionType, round: RoundListEntity) => void;
}) => {
  const navigate = useNavigate();

  return (
    <Card key={round.id} className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle className="text-lg">
              Round {round.roundNumber}: {round.name}
            </CardTitle>
            <CardDescription>
              <Badge
                variant={getBadgeVariant(round.status)}
                className="capitalize">
                {round.status}
              </Badge>
            </CardDescription>
          </div>
          <ActionMenu>
            <ActionMenuItem
              label="Details"
              icon={<Eye className="mr-2 h-4 w-4" />}
              callback={() => onAction('detail', round)}
            />
            <ActionMenuItem
              label="Edit"
              icon={<Pencil className="mr-2 h-4 w-4" />}
              callback={() => onAction('update', round)}
            />
            <ActionMenuItem
              label="Delete"
              icon={<Trash2 className="mr-2 h-4 w-4" />}
              className="text-red-500"
              callback={() => onAction('delete', round)}
            />
          </ActionMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <Separator />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Gift className="h-4 w-4" />
          <span>
            Prize: <strong className="text-foreground">{round.prize}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Starts:{' '}
            <strong className="text-foreground">
              {formatDate(round.startedAt, { variant: 'dateTime' })}
            </strong>
          </span>
        </div>
        <div>
          <Button
            onClick={() =>
              navigate(
                `/dashboard/games/${round?.game.id}/rounds/${round.id}/play`
              )
            }>
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface RoundListProps {
  gameId?: string;
}

export const RoundList: React.FC<RoundListProps> = withAnimation(
  ({ gameId }) => {
    const { states, actions } = useVisibilityManager<ActionType>([
      'create',
      'detail',
      'update',
      'delete'
    ]);

    const roundRef = useRef<RoundListEntity | null>(null);
    const PAGE_SIZE = useConfigStore((state) => state.PAGE_SIZE);
    const [searchParams, setSearchParams] = useState<RoundQueryParamsIface>({
      offset: 0,
      limit: PAGE_SIZE,
      gameId: gameId ? gameId : undefined
    });

    const paginationRef = useRef<CustomPaginationRefIFace | null>(null);
    const roundsQuery = useQuery<PaginatedResponse<RoundListEntity>>(
      urls.getRoundsUrl(), // Fetch rounds for the specific game
      { params: searchParams }
    );

    const rounds = useMemo(
      () => roundsQuery.data?.results || [],
      [roundsQuery.data?.results]
    );

    const handleSearchChange = (search: string | undefined) => {
      paginationRef.current?.reset();
      setSearchParams((prev) => ({ ...prev, offset: 0, search }));
    };

    const openDialog = (name: ActionType, round: RoundListEntity) => {
      roundRef.current = round;
      actions.open(name);
    };

    return (
      <Card className="border-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Game Rounds</CardTitle>
              <CardDescription>
                Manage the individual rounds for this game session.
              </CardDescription>
            </div>
            <CardAction>
              <Button onClick={() => actions.toggle('create')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Round
              </Button>
            </CardAction>
          </div>
        </CardHeader>

        <CardHeader>
          <SearchInput
            placeholder="Search by round name..."
            onDebouncedChange={handleSearchChange}
            className="w-full md:max-w-sm"
          />
        </CardHeader>

        <CardContent>
          {roundsQuery.isLoading && <Spinner variant="page" />}
          {roundsQuery.isError && (
            <ApiError
              error={roundsQuery.error}
              customAction={{ label: 'Refresh', handler: roundsQuery.refetch }}
            />
          )}
          {roundsQuery.isSuccess && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roundsQuery.data?.results.length ? (
                rounds.map((round) => (
                  <RoundCard
                    key={round.id}
                    round={round}
                    onAction={openDialog}
                  />
                ))
              ) : (
                <EmptyList itemName="rounds" />
              )}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <CustomPagination
            ref={paginationRef}
            totalItems={roundsQuery.data?.count || 0}
            pageSize={PAGE_SIZE}
            onPageChange={(page) =>
              setSearchParams((prev) => ({ ...prev, offset: page * PAGE_SIZE }))
            }
          />

          <CreateRound
            gameId={gameId || ''}
            open={states.create}
            onOpenChange={(open) => actions.set('create', open)}
            callback={(success) =>
              success ? roundsQuery.refetch() : undefined
            }
          />
          {roundRef.current && (
            <>
              <RoundDetail
                gameId={gameId || ''}
                roundId={roundRef.current.id}
                open={states.detail}
                onOpenChange={(open) => actions.set('detail', open)}
              />
              {/*
              <UpdateRound
                roundId={roundRef.current.id}
                open={states.update}
                onOpenChange={(open) => actions.set('update', open)}
                callback={(success) => (success ? roundsQuery.refetch() : null)}
              />
              */}
              <DestroyRound
                round={roundRef.current}
                open={states.delete}
                onOpenChange={(open) => actions.set('delete', open)}
                callback={(success) => (success ? roundsQuery.refetch() : null)}
              />
            </>
          )}
        </CardFooter>
      </Card>
    );
  }
);
