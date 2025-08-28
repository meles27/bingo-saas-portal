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
  RoleListEntity,
  RoleQueryParamsType
} from '@/types/api/base/role.type';
import { Eye, KeyRound, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRole } from './create-role';
import { DestroyRole } from './destroy-role';
import { RoleDetail } from './role-detail';
import { UpdateRole } from './update-role';

type ActionType = 'detail' | 'update' | 'delete' | 'create';

export const RoleList = withAnimation(() => {
  /**
   * dialog managers
   */
  const { states, actions } = useVisibilityManager<ActionType>([
    'create',
    'detail',
    'update',
    'delete'
  ]);

  const navigete = useNavigate();

  const roleRef = useRef<RoleListEntity | null>(null);
  const PAGE_SIZE = useConfigStore((state) => state.PAGE_SIZE);
  const [searchParams, setSearchParams] = useState<RoleQueryParamsType>({
    offset: 0,
    limit: PAGE_SIZE
  });

  const paginationRef = useRef<CustomPaginationRefIFace | null>(null);
  const rolesQuery = useQuery<PaginatedResponse<RoleListEntity>>(
    urls.getRolesUrl(),
    {
      params: searchParams
    }
  );

  const roles = useMemo(
    () => rolesQuery.data?.results || [],
    [rolesQuery.data?.results]
  );

  const handleSearchChange = (search: string | undefined) => {
    paginationRef.current?.reset();
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
      search
    }));
  };

  const openDialog = (name: ActionType, role: RoleListEntity) => {
    roleRef.current = role;
    actions.open(name);
  };

  return (
    <Card className="shadow-none border-none">
      {/* header 1 */}
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Roles List</CardTitle>
            <CardDescription>See information about roles.</CardDescription>
          </div>
          <CardAction>
            <Button onClick={() => actions.toggle('create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Role
            </Button>
          </CardAction>
        </div>
      </CardHeader>

      {/* header 2 */}
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <SearchInput
            placeholder="Search by name or rolename..."
            onDebouncedChange={handleSearchChange}
            className="w-full md:max-w-sm"
          />
        </div>
      </CardHeader>
      {/* main content */}
      <CardContent>
        {/* loading */}
        {rolesQuery.isLoading && <Spinner variant="page" />}
        {/* error */}
        {rolesQuery.isError && (
          <ApiError
            error={rolesQuery.error}
            customAction={{
              label: 'Refresh',
              handler: rolesQuery.refetch
            }}
          />
        )}
        {/* success */}
        {rolesQuery.isSuccess && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rolesQuery.data?.results.length ? (
              roles.map((role) => (
                <Card className="gap-2" key={role.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1.5 pr-4">
                        <CardTitle className="flex items-center gap-2">
                          <span>{role.name}</span>
                          {role.isDefault && (
                            <Badge variant="outline">Default</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <TruncatedText
                            text={role.description}
                            maxLength={50}
                            className="text-sm text-muted-foreground"
                          />
                        </CardDescription>
                      </div>
                      <ActionMenu>
                        <ActionMenuItem
                          label="Detail"
                          icon={<Eye className="mr-2 h-4 w-4" />}
                          callback={() => openDialog('detail', role)}
                          hide={false}
                        />
                        <ActionMenuItem
                          label="Edit"
                          icon={<Pencil className="mr-2 h-4 w-4" />}
                          callback={() => openDialog('update', role)}
                          hide={false}
                        />
                        <ActionMenuItem
                          label="Delete"
                          icon={<Trash2 className="mr-2 h-4 w-4" color="red" />}
                          className="text-red-500"
                          callback={() => openDialog('delete', role)}
                          hide={false}
                        />
                      </ActionMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow py-0" />

                  <CardFooter>
                    <CardAction
                      className="flex flex-col w-full items-end"
                      onClick={() =>
                        navigete(
                          `/dashboard/roles/${role.id}/assign-permissions`
                        )
                      }>
                      <Button variant="outline" size="sm">
                        <KeyRound />
                        Permissions
                      </Button>
                    </CardAction>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <EmptyList itemName="roles" />
            )}
          </div>
        )}
      </CardContent>
      {/* footer */}
      <CardFooter>
        <CustomPagination
          ref={paginationRef}
          totalItems={rolesQuery.data?.count || 0}
          pageSize={PAGE_SIZE}
          onPageChange={(page) =>
            setSearchParams((prev) => ({
              ...prev,
              offset: page * PAGE_SIZE
            }))
          }
        />

        <CreateRole
          open={states.create}
          onOpenChange={(open) => actions.set('create', open)}
          callback={(success) => (success ? rolesQuery.refetch() : undefined)}
        />
        {/* dialogs */}
        {roleRef.current && (
          <>
            <RoleDetail
              role={roleRef.current}
              open={states.detail}
              onOpenChange={(open) => actions.set('detail', open)}
            />
            <UpdateRole
              role={roleRef.current}
              open={states.update}
              onOpenChange={(open) => actions.set('update', open)}
              callback={(success) => (success ? rolesQuery.refetch() : null)}
            />
            <DestroyRole
              role={roleRef.current}
              open={states.delete}
              onOpenChange={(open) => actions.set('delete', open)}
              callback={(success) => (success ? rolesQuery.refetch() : null)}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
});
