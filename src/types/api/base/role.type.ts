import type { BaseQueryParams } from '.';

export interface RoleEntity {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export type RoleQueryParamsType = BaseQueryParams & {};
