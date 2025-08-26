import { ActionMenu, ActionMenuItem } from '@/components/base/action-menu';
import { ApiError } from '@/components/base/api-error';
import {
  CustomPagination,
  type CustomPaginationRefIFace
} from '@/components/base/custom-pagination';
import { EmptyList } from '@/components/base/empty-list';
import HorizontalDragScroll from '@/components/base/horizontal-drag-scroll';
import withAnimation from '@/components/base/route-animation/with-animation';
import { SearchInput } from '@/components/base/search-input';
import { Spinner } from '@/components/base/spinner';
import { UserAvatar } from '@/components/base/user-avatar';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { urls } from '@/config/urls';
import { useQuery } from '@/hooks/base/api/useQuery';
import { useVisibilityManager } from '@/hooks/base/use-visibility-control';
import { useConfigStore } from '@/store/configStore';
import type { PaginatedResponse } from '@/types/api/base';
import type {
  UserEntity,
  UserQueryParamsType
} from '@/types/api/base/user.type';
import { Eye, Trash2, UserCheck, UserCog, UserPlus, UserX } from 'lucide-react';
import { useRef, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';
import { AssignUserRoles } from './assign-user-roles';
import { ChangeUserStatus } from './change-user-status';
import { CreateUser } from './create-user';
import { DestroyUser } from './destroy-user';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'true' },
  { label: 'Suspended', value: 'false' }
];
type ActionType =
  | 'retrieve'
  | 'update'
  | 'delete'
  | 'create'
  | 'assign-role'
  | 'status';

export const ListUsers = withAnimation(() => {
  const userRef = useRef<UserEntity | null>(null);
  const paginationRef = useRef<CustomPaginationRefIFace | null>(null);
  const PAGE_SIZE = useConfigStore((state) => state.PAGE_SIZE);
  const { states, actions } = useVisibilityManager<ActionType>([
    'create',
    'retrieve',
    'delete',
    'assign-role',
    'status'
  ]);
  const [searchParams, setSearchParams] = useState<UserQueryParamsType>({
    offset: 0,
    limit: PAGE_SIZE,
    search: ''
  });

  const listUsersResponse = useQuery<PaginatedResponse<UserEntity>>(
    urls.USERS_URL,
    {
      params: searchParams
    }
  );
  const handleTabChange = (value: string) => {
    paginationRef.current?.reset();
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
      active: value === 'all' ? undefined : value === 'true'
    }));
  };

  const handleSearchChange = (search: string | undefined) => {
    paginationRef.current?.reset();
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
      search
    }));
  };

  const openDialog = (name: ActionType, user: UserEntity) => {
    userRef.current = user;
    actions.open(name);
  };

  return (
    <div className="w-full">
      <Card className="shadow-none border-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Members List</CardTitle>
              <CardDescription>
                Browse, manage, and search for team members.
              </CardDescription>
            </div>
            <Button onClick={() => actions.open('create')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Tabs
              defaultValue="all"
              onValueChange={handleTabChange}
              className="w-full md:w-auto">
              <TabsList>
                {TABS.map(({ label, value }) => (
                  <TabsTrigger key={value} value={value}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <SearchInput
              placeholder="Search by name or username..."
              onDebouncedChange={handleSearchChange}
              className="w-full md:max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {listUsersResponse.isLoading && <Spinner variant="page" />}
          {listUsersResponse.isError && (
            <ApiError
              error={listUsersResponse.error}
              customAction={{
                label: 'Refresh',
                handler: listUsersResponse.refetch
              }}
            />
          )}
          {listUsersResponse.isSuccess && (
            <HorizontalDragScroll>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listUsersResponse.data?.results.length ? (
                    listUsersResponse.data.results.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {(paginationRef.current?.getCurrentPage() || 0) *
                            PAGE_SIZE +
                            index +
                            1}
                        </TableCell>
                        <TableCell>
                          <UserAvatar
                            user={{
                              first_name: user.first_name,
                              last_name: user.last_name,
                              email: user.email,
                              username: user.username,
                              imageUrl: user.image
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status == 'active' ? 'default' : 'secondary'
                            }>
                            {user.status == 'active' ? 'Active' : 'Suspended'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <ReactTimeAgo
                            date={new Date(user.date_joined)}
                            locale="en-US"
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <ReactTimeAgo
                            date={new Date(user.last_login)}
                            locale="en-US"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionMenu label="User Actions">
                            <ActionMenuItem
                              label="View Profile"
                              icon={<Eye className="h-4 w-4" />}
                              callback={() => openDialog('retrieve', user)}
                            />
                            <ActionMenuItem
                              label="change status"
                              icon={
                                user.status == 'active' ? (
                                  <UserX className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )
                              }
                              callback={() => openDialog('status', user)}
                            />
                            <ActionMenuItem
                              label="Assign User Roles"
                              icon={<UserCog className="h-4 w-4" />}
                              callback={() => openDialog('assign-role', user)}
                            />
                            <ActionMenuItem
                              label="Delete"
                              icon={<Trash2 className="h-4 w-4" />}
                              className="text-destructive"
                              callback={() =>
                                actions.open(
                                  'delete',
                                  () => (userRef.current = user)
                                )
                              }
                            />
                          </ActionMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <EmptyList itemName="user" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </HorizontalDragScroll>
          )}
        </CardContent>
        <CardFooter>
          <CustomPagination
            ref={paginationRef}
            totalItems={listUsersResponse.data?.count || 0}
            pageSize={PAGE_SIZE}
            onPageChange={(page) =>
              setSearchParams((prev) => ({
                ...prev,
                offset: page * PAGE_SIZE
              }))
            }
          />
        </CardFooter>
      </Card>

      {/* --- Dialogs --- */}
      <CreateUser
        open={states.create}
        onOpenChange={(open) => actions.set('create', open)}
        callback={(success) => (success ? listUsersResponse.refetch() : null)}
      />
      {userRef.current && (
        <>
          <ChangeUserStatus
            user={userRef.current}
            open={states.status}
            onOpenChange={(open) => actions.set('status', open)}
            callback={(success) =>
              success ? listUsersResponse.refetch() : null
            }
          />
          <DestroyUser
            user={userRef.current}
            open={states.delete}
            onOpenChange={(open) => actions.set('delete', open)}
            callback={(success) =>
              success ? listUsersResponse.refetch() : null
            }
          />
          <AssignUserRoles
            user={userRef.current}
            open={states['assign-role']}
            onOpenChange={(open) => actions.set('assign-role', open)}
            callback={(success) =>
              success ? listUsersResponse.refetch() : null
            }
          />
          {/* Add other dialogs like UpdateProfile and ChangeUserRole here */}
        </>
      )}
    </div>
  );
});
