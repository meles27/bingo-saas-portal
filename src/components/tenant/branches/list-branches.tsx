import { Can } from '@/components/auth/can';
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/api/useQuery';
import { useVisibilityManager } from '@/hooks/use-visibility-control';
import { useConfigStore } from '@/store/configStore';
import type { PaginatedResponse } from '@/types/api';
import type {
  BranchEntity,
  BranchQueryParamsType
} from '@/types/api/branch.type';
import { Building2, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { CreateBranch } from './create-branch';
import { DestroyBranch } from './destroy-branch';
import { RetrieveBranch } from './retrieve-branch';
import { UpdateBranchForm } from './update-branch';

type ActionType = 'retrieve' | 'update' | 'delete' | 'create';

export const ListBranches = withAnimation(() => {
  const { states, actions } = useVisibilityManager<ActionType>([
    'create',
    'retrieve',
    'update',
    'delete'
  ]);

  const branchRef = useRef<BranchEntity | null>(null);
  const PAGE_SIZE = useConfigStore((state) => state.PAGE_SIZE);
  const [searchParams, setSearchParams] = useState<BranchQueryParamsType>({
    offset: 0,
    limit: PAGE_SIZE,
    search: ''
  });

  const paginationRef = useRef<CustomPaginationRefIFace | null>(null);
  const branchesQuery = useQuery<PaginatedResponse<BranchEntity>>(
    urls.BRANCHES_URL,
    {
      params: searchParams
    }
  );

  const handleSearchChange = (search: string | undefined) => {
    paginationRef.current?.reset();
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
      search
    }));
  };

  const openDialog = (name: ActionType, branch: BranchEntity) => {
    branchRef.current = branch;
    actions.open(name);
  };

  return (
    <div>
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Branches</CardTitle>
              <CardDescription>
                Manage your organization's branches and their locations.
              </CardDescription>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <SearchInput
                onDebouncedChange={handleSearchChange}
                className="w-full sm:w-auto"
                placeholder="Search by name..."
              />
              <Can I={['branch.create']}>
                <Button
                  className="sm:w-auto"
                  onClick={() => actions.open('create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Branch
                </Button>
              </Can>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {branchesQuery.isLoading && <Spinner variant="page" />}
          {branchesQuery.isError && (
            <ApiError
              error={branchesQuery.error}
              customAction={{
                label: 'Refresh',
                handler: branchesQuery.refetch
              }}
            />
          )}
          {branchesQuery.isSuccess &&
            (branchesQuery.data?.results.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {branchesQuery.data?.results.map((branch) => (
                  <Card
                    key={branch.id}
                    className="flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {branch.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Created{' '}
                            <ReactTimeAgo
                              date={new Date(branch.created_at)}
                              locale="en-US"
                            />
                          </CardDescription>
                        </div>
                        <ActionMenu label="Actions">
                          <ActionMenuItem
                            label="Edit Branch"
                            icon={<Pencil className="h-4 w-4" />}
                            callback={() => openDialog('update', branch)}
                          />
                          <ActionMenuItem
                            label="Delete Branch"
                            icon={<Trash2 className="h-4 w-4" />}
                            className="text-destructive"
                            callback={() => openDialog('delete', branch)}
                          />
                        </ActionMenu>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {branch.locations.length} Locations
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2">
                        {branch.locations.slice(0, 3).map((location) => (
                          <div
                            key={location.id}
                            className="flex items-start gap-3">
                            <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {location.address}
                            </p>
                          </div>
                        ))}
                        {branch.locations.length > 3 && (
                          <p className="text-xs text-muted-foreground italic pt-2">
                            + {branch.locations.length - 3} more locations
                          </p>
                        )}
                        {branch.locations.length === 0 && (
                          <p className="text-sm text-muted-foreground italic">
                            No locations have been assigned.
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openDialog('retrieve', branch)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <EmptyList itemName="branches" />
              </div>
            ))}
        </CardContent>
        <CardFooter className="flex justify-center">
          {branchesQuery.data && branchesQuery.data.count > 0 && (
            <CustomPagination
              ref={paginationRef}
              totalItems={branchesQuery.data.count}
              pageSize={PAGE_SIZE}
              onPageChange={(page) =>
                setSearchParams((prev) => ({
                  ...prev,
                  offset: page * PAGE_SIZE
                }))
              }
            />
          )}
        </CardFooter>
      </Card>

      {/* --- Dialogs --- */}
      <CreateBranch
        open={states.create}
        onOpenChange={(open) => actions.set('create', open)}
        callback={(success) => (success ? branchesQuery.refetch() : null)}
      />
      {branchRef.current && (
        <>
          <RetrieveBranch
            branch={branchRef.current}
            open={states.retrieve}
            onOpenChange={(open) => actions.set('retrieve', open)}
          />
          <UpdateBranchForm
            branch={branchRef.current}
            open={states.update}
            onOpenChange={(open) => actions.set('update', open)}
            callback={(success) => (success ? branchesQuery.refetch() : null)}
          />
          <DestroyBranch
            branch={branchRef.current}
            open={states.delete}
            onOpenChange={(open) => actions.set('delete', open)}
            callback={(success) => (success ? branchesQuery.refetch() : null)}
          />
        </>
      )}
    </div>
  );
});
