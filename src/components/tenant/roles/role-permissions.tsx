import { ApiError } from '@/components/base/api-error';
import { EmptyList } from '@/components/base/empty-list';
import { PullToRefreshButton } from '@/components/base/pull-to-refresh-button';
import withAnimation from '@/components/base/route-animation/with-animation';
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
import { useApiResponseToast } from '@/hooks/api/use-api-response-toast';
import { useMutation } from '@/hooks/api/useMutation';
import { useQuery } from '@/hooks/api/useQuery';
import type { PaginatedResponse } from '@/types/api';
import type {
  PermissionEntity,
  RolePermissionEntity
} from '@/types/api/permission.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Show } from 'react-smart-conditional';
import { z } from 'zod';

export const AssignPermissionSchema = z.object({
  permissions: z.array(
    z.object({
      permission_id: z.string(),
      is_temporary: z.boolean()
    })
  )
});

export type TAssignPermissionSchema = z.infer<typeof AssignPermissionSchema>;

// --- "Dumb" Presentational PermissionCard Component ---

interface PermissionCardProps {
  permission: PermissionEntity;
  isChecked: boolean;
  is_temporary: boolean;
  onCheckedChange: (checked: boolean) => void;
  onTemporaryChange: (is_temporary: boolean) => void;
}

const PermissionCard = ({
  permission,
  isChecked,
  is_temporary,
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
            checked={is_temporary}
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
  const form = useForm<TAssignPermissionSchema>({
    resolver: zodResolver(AssignPermissionSchema),
    defaultValues: {
      permissions: []
    }
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isDirty }
  } = form;

  const selectedPermissions = watch('permissions');

  const permissionsQuery = useQuery<PaginatedResponse<PermissionEntity>>(
    urls.PERMISSIONS_URL,
    {
      params: { limit: 1000 }
    }
  );

  const rolePermissionsQuery = useQuery<
    PaginatedResponse<RolePermissionEntity>
  >(urls.ROLE_PERMISSIONS_URL.replace(':roleId', params.roleId!), {
    skip: !params.roleId
  });

  const rolePermissionsMutation = useMutation<object, TAssignPermissionSchema>(
    urls.ROLE_PERMISSIONS_URL.replace(':roleId', params.roleId!),
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
          permission_id: rp.permission.id,
          is_temporary: rp.is_temporary
        })
      );
      setValue('permissions', initialPermissions, { shouldDirty: false });
    }
  }, [rolePermissionsQuery.data, setValue]);

  const handleCheckedChange = useCallback(
    (permission_id: string, checked: boolean) => {
      const currentValues = getValues('permissions');
      if (checked) {
        setValue(
          'permissions',
          [...currentValues, { permission_id, is_temporary: false }],
          { shouldDirty: true }
        );
      } else {
        setValue(
          'permissions',
          currentValues.filter((p) => p.permission_id !== permission_id),
          { shouldDirty: true }
        );
      }
    },
    [getValues, setValue]
  );

  const handleTemporaryChange = useCallback(
    (permission_id: string, is_temporary: boolean) => {
      const currentValues = getValues('permissions');
      setValue(
        'permissions',
        currentValues.map((p) =>
          p.permission_id === permission_id ? { ...p, is_temporary } : p
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
    selectedPermissions.map((p) => [p.permission_id, p])
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>Manage Role Permissions</CardTitle>
            <CardDescription>
              Select the permissions to assign to this role. You can also mark
              specific permissions as temporary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Show>
              <Show.If condition={isLoading}>
                <Spinner variant="page" />
              </Show.If>

              <Show.If condition={isError}>
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
              </Show.If>

              <Show.If condition={isSuccess}>
                <Show>
                  <Show.If condition={!!groupedPermissions.length}>
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
                              const is_temporary = state?.is_temporary ?? false;

                              return (
                                <PermissionCard
                                  key={permission.id}
                                  permission={permission}
                                  isChecked={isChecked}
                                  is_temporary={is_temporary}
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
                  </Show.If>
                  <Show.Else>
                    <EmptyList itemName="permissions" />
                  </Show.Else>
                </Show>
              </Show.If>
            </Show>
          </CardContent>
          <CardFooter className="flex justify-end sticky bottom-0 bg-background py-4 border-t">
            <Button
              type="submit"
              disabled={rolePermissionsMutation.isLoading || !isDirty}>
              {rolePermissionsMutation.isLoading && (
                <Loader2 className="animate-spin mr-2" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>

      <PullToRefreshButton onRefresh={() => rolePermissionsQuery.refetch()} />
    </>
  );
});
