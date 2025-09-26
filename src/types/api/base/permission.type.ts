import type { BaseQueryParams } from '.';

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
  isTemporary: boolean;
  permission: PermissionEntity;
}

export type PermissionQueryParamsIface = BaseQueryParams & {};
