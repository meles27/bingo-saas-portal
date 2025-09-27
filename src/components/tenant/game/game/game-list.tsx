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
import { TruncatedText } from '@/components/base/truncated-text';
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
  GameListEntity,
  GameQueryParamsIface,
  GameStatus
} from '@/types/api/game/game.type';
import {
  Calendar,
  Eye,
  Pencil,
  PlayCircle,
  PlusCircle,
  Repeat,
  Ticket,
  Trash2
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateGame } from './create-game';
import { DestroyGame } from './destroy-game';
import { GameDetail } from './game-detail';
import { UpdateGame } from './update-game';
// import { CreateGame } from './create-game';
// import { DestroyGame } from './destroy-game';
// import { GameDetail } from './game-detail';
// import { UpdateGame } from './update-game';

type ActionType = 'detail' | 'update' | 'delete' | 'create';

/**
 * Helper to determine badge color based on game status.
 */
const getBadgeVariant = (status: GameStatus) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'outline';
    case 'cancelled':
      return 'destructive';
    case 'pending':
    default:
      return 'secondary';
  }
};

/**
 * A dedicated card component to display game information.
 */
const GameCard = ({
  game,
  onAction
}: {
  game: GameListEntity;
  onAction: (name: ActionType, game: GameListEntity) => void;
}) => {
  const navigate = useNavigate();

  return (
    <Card key={game.id} className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle className="flex items-center gap-2 flex-wrap">
              <span className="leading-tight">{game.name}</span>
              <Badge
                variant={getBadgeVariant(game.status)}
                className="capitalize">
                {game.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              <TruncatedText text={game.description || ''} maxLength={100} />
            </CardDescription>
          </div>
          <ActionMenu>
            <ActionMenuItem
              label="Details"
              icon={<Eye className="mr-2 h-4 w-4" />}
              callback={() => onAction('detail', game)}
            />
            <ActionMenuItem
              label="Edit"
              icon={<Pencil className="mr-2 h-4 w-4" />}
              callback={() => onAction('update', game)}
            />
            <ActionMenuItem
              label="Delete"
              icon={<Trash2 className="mr-2 h-4 w-4" />}
              className="text-red-500"
              callback={() => onAction('delete', game)}
            />
          </ActionMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <Separator />
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Ticket className="h-4 w-4" />
            <span className="space-x-1">
              <span> Entry Fee:</span>

              <strong className="text-foreground">
                {game.entryFee} {game.currency}
              </strong>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Repeat className="h-4 w-4" />
            <span className="space-x-1">
              <span>Total Rounds:</span>
              <strong className="text-foreground">{game.totalRounds}</strong>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4" />
            <span className="space-x-1">
              <span>Starts:</span>
              <strong className="text-foreground">
                {formatDate(game.startedAt, {
                  variant: 'dateTime'
                })}
              </strong>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          className="w-full"
          onClick={() => navigate(`/dashboard/games/${game.id}/rounds`)}>
          <PlayCircle className="mr-2 h-4 w-4" />
          Manage Rounds
        </Button>
      </CardFooter>
    </Card>
  );
};

export const GameList = withAnimation(() => {
  const { states, actions } = useVisibilityManager<ActionType>([
    'create',
    'detail',
    'update',
    'delete'
  ]);

  const gameRef = useRef<GameListEntity | null>(null);
  const PAGE_SIZE = useConfigStore((state) => state.PAGE_SIZE);
  const [searchParams, setSearchParams] = useState<GameQueryParamsIface>({
    offset: 0,
    limit: PAGE_SIZE
  });

  const paginationRef = useRef<CustomPaginationRefIFace | null>(null);
  const gamesQuery = useQuery<PaginatedResponse<GameListEntity>>(
    urls.getGamesUrl(),
    {
      params: searchParams
    }
  );

  const games = useMemo(
    () => gamesQuery.data?.results || [],
    [gamesQuery.data?.results]
  );

  const handleSearchChange = (search: string | undefined) => {
    paginationRef.current?.reset();
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
      search
    }));
  };

  const openDialog = (name: ActionType, game: GameListEntity) => {
    gameRef.current = game;
    actions.open(name);
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Bingo Games</CardTitle>
            <CardDescription>
              Create, manage, and monitor your bingo game sessions.
            </CardDescription>
          </div>
          <CardAction>
            <Button onClick={() => actions.toggle('create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Game
            </Button>
          </CardAction>
        </div>
      </CardHeader>

      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <SearchInput
            placeholder="Search by name or description..."
            onDebouncedChange={handleSearchChange}
            className="w-full md:max-w-sm"
          />
        </div>
      </CardHeader>

      <CardContent>
        {gamesQuery.isLoading && <Spinner variant="page" />}
        {gamesQuery.isError && (
          <ApiError
            error={gamesQuery.error}
            customAction={{
              label: 'Refresh',
              handler: gamesQuery.refetch
            }}
          />
        )}
        {gamesQuery.isSuccess && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gamesQuery.data?.results.length ? (
              games.map((game) => (
                <GameCard key={game.id} game={game} onAction={openDialog} />
              ))
            ) : (
              <EmptyList itemName="games" />
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <CustomPagination
          ref={paginationRef}
          totalItems={gamesQuery.data?.count || 0}
          pageSize={PAGE_SIZE}
          onPageChange={(page) =>
            setSearchParams((prev) => ({
              ...prev,
              offset: page * PAGE_SIZE
            }))
          }
        />

        <CreateGame
          open={states.create}
          onOpenChange={(open) => actions.set('create', open)}
          callback={(success) => (success ? gamesQuery.refetch() : undefined)}
        />

        {gameRef.current && (
          <>
            <GameDetail
              gameId={gameRef.current.id}
              open={states.detail}
              onOpenChange={(open) => actions.set('detail', open)}
            />

            <UpdateGame
              gameId={gameRef.current.id}
              open={states.update}
              onOpenChange={(open) => actions.set('update', open)}
              callback={(success) => (success ? gamesQuery.refetch() : null)}
            />

            <DestroyGame
              game={gameRef.current}
              open={states.delete}
              onOpenChange={(open) => actions.set('delete', open)}
              callback={(success) => (success ? gamesQuery.refetch() : null)}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
});
