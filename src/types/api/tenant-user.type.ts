import type { BaseQueryParams } from '.';

export type TenantUserQueryParams = BaseQueryParams & {
  active?: boolean;
  includeDeleted?: boolean;
};
