import type { BaseQueryParams } from '.';

interface Location {
  id: string;
  created_at: string;
  updated_at: string;
  address: string;
}

export interface BranchEntity {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  locations: Location[];
}

export type BranchQueryParamsType = BaseQueryParams & {
  active?: boolean;
};
