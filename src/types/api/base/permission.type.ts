export interface PermissionEntity {
  id: string;
  code: string;
  name: string;
  group: string;
  applicability: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  is_temporary: boolean;
  permission: PermissionEntity;
}
