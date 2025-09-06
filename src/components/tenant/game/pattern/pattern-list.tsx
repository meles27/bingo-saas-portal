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
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import { useVisibilityManager } from '@/hooks/base/use-visibility-control';
import { useConfigStore } from '@/store/configStore';
import type { PaginatedResponse } from '@/types/api/base';
import type {
  PatternListEntity,
  PatternQueryParamsIface
} from '@/types/api/game/pattern.type';
import { Eye, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { CreatePattern } from './create-pattern';
import { DestroyPattern } from './destroy-pattern';
import { PatternDetail } from './pattern-detail';
import { PatternVisualizer } from './pattern-visualizer';
import { UpdatePattern } from './update-pattern';

type ActionType = 'detail' | 'update' | 'delete' | 'create';

export const PatternList = withAnimation(() => {
  /**
   * Dialog managers
   */
  const { states, actions } = useVisibilityManager<ActionType>([
    'create',
    'detail',
    'update',
    'delete'
  ]);

  const patternRef = useRef<PatternListEntity | null>(null);
  const PAGE_SIZE = useConfigStore((state) => state.PAGE_SIZE);
  const [searchParams, setSearchParams] = useState<PatternQueryParamsIface>({
    offset: 0,
    limit: PAGE_SIZE
  });

  const paginationRef = useRef<CustomPaginationRefIFace | null>(null);
  const patternsQuery = useQuery<PaginatedResponse<PatternListEntity>>(
    urls.getPatternsUrl(),
    {
      params: searchParams
    }
  );

  const patterns = useMemo(
    () => patternsQuery.data?.results || [],
    [patternsQuery.data?.results]
  );

  const handleSearchChange = (search: string | undefined) => {
    paginationRef.current?.reset();
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
      search
    }));
  };

  const openDialog = (name: ActionType, pattern: PatternListEntity) => {
    patternRef.current = pattern;
    actions.open(name);
  };

  return (
    <Card className="shadow-none border-none">
      {/* header 1 */}
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Bingo Patterns</CardTitle>
            <CardDescription>
              Manage winning patterns for your bingo games.
            </CardDescription>
          </div>
          <CardAction>
            <Button
              className="text-foreground dark:text-yellow-300"
              onClick={() => actions.toggle('create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Pattern
            </Button>
          </CardAction>
        </div>
      </CardHeader>

      {/* header 2 */}
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <SearchInput
            placeholder="Search by name or description..."
            onDebouncedChange={handleSearchChange}
            className="w-full md:max-w-sm"
          />
        </div>
      </CardHeader>
      {/* main content */}
      <CardContent>
        {/* loading */}
        {patternsQuery.isLoading && <Spinner variant="page" />}
        {/* error */}
        {patternsQuery.isError && (
          <ApiError
            error={patternsQuery.error}
            customAction={{
              label: 'Refresh',
              handler: patternsQuery.refetch
            }}
          />
        )}
        {/* success */}
        {patternsQuery.isSuccess && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patternsQuery.data?.results.length ? (
              patterns.map((pattern) => (
                <Card className="flex flex-col gap-2" key={pattern.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1.5 pr-4">
                        <CardTitle className="flex items-center gap-2">
                          <span>{pattern.name}</span>
                          <Badge variant="outline" className="capitalize">
                            {pattern.type}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          <TruncatedText
                            text={pattern.description || ''}
                            maxLength={50}
                            className="text-sm text-muted-foreground"
                          />
                        </CardDescription>
                      </div>
                      <ActionMenu>
                        <ActionMenuItem
                          label="Detail"
                          icon={<Eye className="mr-2 h-4 w-4" />}
                          callback={() => openDialog('detail', pattern)}
                        />
                        <ActionMenuItem
                          label="Edit"
                          icon={<Pencil className="mr-2 h-4 w-4" />}
                          callback={() => openDialog('update', pattern)}
                        />
                        <ActionMenuItem
                          label="Delete"
                          icon={<Trash2 className="mr-2 h-4 w-4" color="red" />}
                          className="text-red-500"
                          callback={() => openDialog('delete', pattern)}
                        />
                      </ActionMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow flex items-center justify-center">
                    <PatternVisualizer coordinates={pattern.coordinates} />
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyList itemName="patterns" />
            )}
          </div>
        )}
      </CardContent>
      {/* footer */}
      <CardFooter>
        <CustomPagination
          ref={paginationRef}
          totalItems={patternsQuery.data?.count || 0}
          pageSize={PAGE_SIZE}
          onPageChange={(page) =>
            setSearchParams((prev) => ({
              ...prev,
              offset: page * PAGE_SIZE
            }))
          }
        />

        <CreatePattern
          open={states.create}
          onOpenChange={(open) => actions.set('create', open)}
          callback={(success) =>
            success ? patternsQuery.refetch() : undefined
          }
        />
        {/* dialogs */}
        {patternRef.current && (
          <>
            <PatternDetail
              patternId={patternRef.current?.id}
              open={states.detail}
              onOpenChange={(open) => actions.set('detail', open)}
            />

            <UpdatePattern
              patternId={patternRef.current?.id}
              open={states.update}
              onOpenChange={(open) => actions.set('update', open)}
              callback={(success) => (success ? patternsQuery.refetch() : null)}
            />

            <DestroyPattern
              pattern={patternRef.current}
              open={states.delete}
              onOpenChange={(open) => actions.set('delete', open)}
              callback={(success) => (success ? patternsQuery.refetch() : null)}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
});
