import type { JwtPayload } from 'jwt-decode';

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

export interface JwtTokenIface {
  access?: string;
  refresh?: string;
}

export interface JwtPayloadIface extends JwtPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  user_id?: string;
  role?: string;
}

export type BaseQueryParams = {
  search?: string;
  offset?: number;
  limit?: number;
};

export interface PaginatedResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
