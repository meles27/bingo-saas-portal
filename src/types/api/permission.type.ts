export interface PermissionEntity {
  id: string;
  code: string;
  name: string;
  group: string;
  applicability: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface RolePermissionEntity {
  id: string;
  created_at: string;
  updated_at: string;
  is_temporary: boolean;
  permission: PermissionEntity;
}
