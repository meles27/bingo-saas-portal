import type { UserStatusValue } from '@/constants/user-status.const';
import type { BaseQueryParams } from '.';

export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string | null;
  status: UserStatusValue;
  imageId: string | null;
  lastLogin: string;
  dateJoined: string;
  deletedAt: null | string;
  phone: string;
}

export interface UserProfileEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string | null;
  status: UserStatusValue;
  image_public_id: string | null;
  lastLogin: string;
  dateJoined: string;
  deletedAt: null | string;
  phone: string;
}

export type UserQueryParamsIface = BaseQueryParams & {
  includeDeleted?: boolean;
  status?: UserStatusValue;
};
