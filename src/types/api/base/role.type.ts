import type { BaseQueryParams } from '.';

export interface RoleListEntity {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

export interface RoleDetailEntity {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export type RoleQueryParamsType = BaseQueryParams & {};
