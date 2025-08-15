import type { BaseQueryParams } from '.';

export interface RoleEntity {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isDefault: boolean;
}

export type RoleQueryParamsType = BaseQueryParams & {};
