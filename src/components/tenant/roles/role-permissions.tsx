import { ApiError } from '@/components/base/api-error';
import { DraggableRefreshButton } from '@/components/base/draggable-refresh-button';
import { EmptyList } from '@/components/base/empty-list';
import withAnimation from '@/components/base/route-animation/with-animation';
import { SearchInput } from '@/components/base/search-input';
import { Spinner } from '@/components/base/spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { urls } from '@/config/urls';
import { useApiResponseToast } from '@/hooks/base/api/use-api-response-toast';
import { useMutation } from '@/hooks/base/api/useMutation';
import { useQuery } from '@/hooks/base/api/useQuery';
import type { PaginatedResponse } from '@/types/api/base';
import type {
  PermissionEntity,
  PermissionQueryParamsIface,
  RolePermissionEntity
} from '@/types/api/base/permission.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

export const AssignPermissionSchema = z.object({
  permissions: z.array(
    z.object({
      permissionId: z.string(),
      isTemporary: z.boolean()
    })
  )
});

export type TAssignPermissionSchema = z.infer<typeof AssignPermissionSchema>;

// --- "Dumb" Presentational PermissionCard Component ---

interface PermissionCardProps {
  permission: PermissionEntity;
  isChecked: boolean;
  isTemporary: boolean;
  onCheckedChange: (checked: boolean) => void;
  onTemporaryChange: (isTemporary: boolean) => void;
}

const PermissionCard = ({
  permission,
  isChecked,
  isTemporary,
  onCheckedChange,
  onTemporaryChange
}: PermissionCardProps) => {
  const handleCardClick = () => {
    onCheckedChange(!isChecked);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className="w-full hover:scale-[1.04] transition duration-300 p-4 space-y-4 cursor-pointer ease-in-out hover:bg-muted/50"
      onClick={handleCardClick}>
      <div className="flex items-start gap-4">
        <div onClick={stopPropagation}>
          <Checkbox
            id={`checkbox-${permission.code}`}
            checked={isChecked}
            onCheckedChange={onCheckedChange}
            className="mt-1 w-6 h-6 aspect-square"
          />
        </div>
        <div className="flex-1">
          <p className="hover:font-semibold italic transition-transform duration-200 ease-in-out hover:text-blue-500 text-xs text-muted-foreground">
            {permission.code}
          </p>
          <p className="text-base font-medium leading-tight">
            {permission.name}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {permission.description}
          </p>
        </div>
      </div>

      <div className="flex gap-6 pl-10" onClick={stopPropagation}>
        <div className="flex items-center space-x-2">
          <Switch
            id={`temp-${permission.code}`}
            checked={isTemporary}
            onCheckedChange={onTemporaryChange}
            disabled={!isChecked}
          />
          <Label
            htmlFor={`temp-${permission.code}`}
            className={
              !isChecked ? 'text-muted-foreground cursor-not-allowed' : ''
            }>
            Temporary
          </Label>
        </div>
      </div>
    </Card>
  );
};

// --- Main Component with Grouping Logic ---

export const RolePermissions = withAnimation(() => {
  const params = useParams<{ roleId: string }>();
  const [searchParams, setSearchParams] = useState<PermissionQueryParamsIface>({
    offset: 0,
    limit: 1000,
    search: ''
  });
  const form = useForm<TAssignPermissionSchema>({
    resolver: zodResolver(AssignPermissionSchema),
    defaultValues: {
      permissions: []
    }
  });
  const { handleSubmit, setValue, getValues, watch } = form;

  const selectedPermissions = watch('permissions');
  const permissionsQuery = useQuery<PaginatedResponse<PermissionEntity>>(
    urls.getPermissionsUrl(),
    {
      params: searchParams
    }
  );

  const rolePermissionsQuery = useQuery<
    PaginatedResponse<RolePermissionEntity>
  >(urls.getRolePermissionsUrl(params.roleId || ''), {
    skip: !params.roleId
  });

  const rolePermissionsMutation = useMutation<object, TAssignPermissionSchema>(
    urls.getRolePermissionsUrl(params.roleId || ''),
    'PATCH'
  );

  useApiResponseToast(
    {
      error: rolePermissionsMutation.error,
      isError: rolePermissionsMutation.isError,
      isSuccess: rolePermissionsMutation.isSuccess
    },
    {
      successMessage: 'Permissions Assigned successfully!'
    }
  );

  useEffect(() => {
    if (rolePermissionsQuery.data) {
      const initialPermissions = rolePermissionsQuery.data.results.map(
        (rp) => ({
          permissionId: rp.permission.id,
          isTemporary: rp.isTemporary
        })
      );
      setValue('permissions', initialPermissions, { shouldDirty: false });
    }
  }, [rolePermissionsQuery.data, setValue]);

  const handleCheckedChange = useCallback(
    (permissionId: string, checked: boolean) => {
      const currentValues = getValues('permissions');
      if (checked) {
        setValue(
          'permissions',
          [...currentValues, { permissionId, isTemporary: false }],
          { shouldDirty: true }
        );
      } else {
        setValue(
          'permissions',
          currentValues.filter((p) => p.permissionId !== permissionId),
          { shouldDirty: true }
        );
      }
    },
    [getValues, setValue]
  );

  const handleTemporaryChange = useCallback(
    (permissionId: string, isTemporary: boolean) => {
      const currentValues = getValues('permissions');
      setValue(
        'permissions',
        currentValues.map((p) =>
          p.permissionId === permissionId ? { ...p, isTemporary } : p
        ),
        { shouldDirty: true }
      );
    },
    [getValues, setValue]
  );

  function onSubmit(data: TAssignPermissionSchema) {
    console.log('submitting');
    rolePermissionsMutation.execute(data);
  }

  const isLoading =
    rolePermissionsQuery.isLoading || permissionsQuery.isLoading;
  const isError = rolePermissionsQuery.isError || permissionsQuery.isError;
  const isSuccess =
    rolePermissionsQuery.isSuccess && permissionsQuery.isSuccess;
  const error = rolePermissionsQuery.error || permissionsQuery.error;

  // Group permissions by the 'group' field for rendering.
  const groupedPermissions = useMemo(() => {
    if (!permissionsQuery.data?.results) return [];

    const groups = permissionsQuery.data.results.reduce((acc, permission) => {
      const groupName = permission.group || 'Uncategorized';
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(permission);
      return acc;
    }, {} as Record<string, PermissionEntity[]>);

    // Convert to an array and sort for consistent ordering
    return Object.entries(groups)
      .map(([groupName, permissions]) => ({
        groupName,
        permissions: permissions.sort((a, b) => a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.groupName.localeCompare(b.groupName));
  }, [permissionsQuery.data]);

  const selectedPermissionsMap = new Map(
    selectedPermissions.map((p) => [p.permissionId, p])
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>Manage Role Permissions</CardTitle>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <CardDescription>
                Select the permissions to assign to this role. You can also mark
                specific permissions as temporary.
              </CardDescription>
              <SearchInput
                onDebouncedChange={(message) =>
                  setSearchParams((prev) => ({ ...prev, search: message }))
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && <Spinner variant="page" />}

            {isError && (
              <ApiError
                error={error}
                customAction={{
                  label: 'Refresh',
                  handler: () => {
                    permissionsQuery.refetch();
                    rolePermissionsQuery.refetch();
                  }
                }}
              />
            )}

            {isSuccess && (
              <>
                {groupedPermissions.length ? (
                  <div className="space-y-8">
                    {groupedPermissions.map(({ groupName, permissions }) => (
                      <div key={groupName} className="space-y-4">
                        <h3 className="text-xl font-semibold tracking-tight border-b pb-2">
                          {groupName}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {permissions.map((permission) => {
                            const state = selectedPermissionsMap.get(
                              permission.id
                            );
                            const isChecked = !!state;
                            const isTemporary = state?.isTemporary ?? false;

                            return (
                              <PermissionCard
                                key={permission.id}
                                permission={permission}
                                isChecked={isChecked}
                                isTemporary={isTemporary}
                                onCheckedChange={(checked) =>
                                  handleCheckedChange(permission.id, checked)
                                }
                                onTemporaryChange={(temp) =>
                                  handleTemporaryChange(permission.id, temp)
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyList itemName="permissions" />
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex self-end justify-end sticky bottom-0 bg-background border-t pb-4">
            <Button type="submit" disabled={rolePermissionsMutation.isLoading}>
              {rolePermissionsMutation.isLoading && (
                <Loader2 className="animate-spin mr-2" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>

      <DraggableRefreshButton
        onRefresh={() => rolePermissionsQuery.refetch()}
      />
    </>
  );
});
