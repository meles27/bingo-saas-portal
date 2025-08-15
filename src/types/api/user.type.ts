import type { UserStatusValue } from '@/constants/user-status.const';
import type { BaseQueryParams } from '.';

export interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  image: string | null;
  status: UserStatusValue;
  image_id: string | null;
  last_login: string;
  date_joined: string;
  delete_at: null | string;
  phone: string;
}

export interface UserProfileEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  image: string | null;
  status: UserStatusValue;
  image_public_id: string | null;
  last_login: string;
  date_joined: string;
  delete_at: null | string;
  phone: string;
}

export type UserQueryParamsType = BaseQueryParams & {
  includeDeleted?: boolean;
  status?: UserStatusValue;
};
