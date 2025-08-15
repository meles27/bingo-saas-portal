import { urls } from '@/config/urls';
import type { UserProfileEntity } from '@/types/api/user.type';
import axiosInstance from '@/utils/interceptors';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthToken {
  access: string;
  refresh: string;
}

export type PermissionScope = string[];

export interface Permissions {
  global: string[];
  branches: [branchId: string, scopes: PermissionScope][];
}

export interface AuthResponse {
  token: AuthToken;
  permissions: Permissions;
  user: UserProfileEntity;
  isSystemUser: boolean;
}

export interface UserJwtPayload extends JwtPayload {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  active?: boolean;
  isSystemUser?: boolean;
}

type AsyncState = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
};

// A tuple representing the outcome of an async operation: [data, error]
type AsyncResult<T, E = unknown> = [T | null, E | null];

type AuthStore = {
  // STATE
  token: AuthResponse['token'];
  user: AuthResponse['user'] | null;
  permissions: AuthResponse['permissions'] | null;
  isSystemUser: boolean;
  loginState: AsyncState;
  refreshState: AsyncState;

  // ACTIONS
  login: (
    username: string,
    password: string
  ) => Promise<AsyncResult<AuthResponse>>;
  logout: () => void;
  refresh: () => Promise<AsyncResult<AuthResponse>>;

  checkPermission: (permission: string, branchId?: string) => boolean;

  // SELECTORS / GETTERS
  decodeJwtToken: (token: string) => UserJwtPayload | null;
  isAccessExpired: () => boolean;
  isRefreshExpired: () => boolean;
  getAccessTimeLeft: () => number;
  getRefreshTimeLeft: () => number;
  isAuthenticated: () => boolean;
};

// --- Initial State Definition ---

const initialAsyncState: AsyncState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null
};

const initialState = {
  token: { access: '', refresh: '' },
  user: null,
  isSystemUser: false,
  permissions: null,
  loginState: initialAsyncState,
  refreshState: initialAsyncState
};

// --- Store Implementation ---

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (username, password) => {
        set({ loginState: { ...initialAsyncState, isLoading: true } });

        try {
          const response = await axiosInstance.post<AuthResponse>(
            urls.AUTH_TOKEN_URL,
            { username, password }
          );

          set({
            token: response.data.token,
            user: response.data.user,
            isSystemUser: response.data.isSystemUser,
            permissions: response.data.permissions,
            loginState: { ...initialAsyncState, isSuccess: true }
          });

          // CHANGED: Return data on success, with null for the error.
          return [response.data, null];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error('Login failed:', error);
          const errorMessage =
            error.response?.data?.detail || 'Login failed. Please try again.';

          set({
            ...initialState,
            loginState: {
              ...initialAsyncState,
              isError: true,
              error: errorMessage
            }
          });

          // CHANGED: Return null for data, with the error object.
          return [null, error];
        }
      },

      logout: () => {
        set(initialState);
      },

      refresh: async () => {
        if (get().refreshState.isLoading) {
          // Avoid returning anything meaningful if a refresh is already in progress
          return [null, { message: 'Refresh already in progress.' }];
        }

        set({ refreshState: { ...initialAsyncState, isLoading: true } });

        try {
          const response = await axiosInstance.post<AuthResponse>(
            urls.AUTH_REFRESH_TOKEN_URL,
            { refresh: get().token.refresh }
          );

          const newTokens: AuthResponse['token'] = {
            ...get().token,
            ...response.data.token
          };

          set({
            token: newTokens,
            user: response.data?.user,
            isSystemUser: response.data?.isSystemUser,
            permissions: response.data?.permissions,
            refreshState: { ...initialAsyncState, isSuccess: true }
          });

          return [response.data, null];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error('Token refresh failed:', error);
          set({
            refreshState: {
              ...initialAsyncState,
              isError: true,
              error: 'Session expired. Please log in again.'
            }
          });
          get().logout(); // Logout user if refresh fails

          // CHANGED: Return null for data, with the error object.
          return [null, error];
        }
      },

      // --- SELECTORS / GETTERS (No changes needed here) ---

      checkPermission: (permission: string, branchId?: string): boolean => {
        const { permissions } = get();

        if (!permissions) {
          return false;
        }

        // 2. Check for a matching global permission.
        if (permissions.global.includes(permission)) {
          return true;
        }

        // 3. If a branchId is provided, check for a matching branch permission.
        if (branchId) {
          const branchTuple = permissions.branches.find(
            ([id]) => id === branchId
          );

          if (branchTuple && branchTuple[1]?.includes(permission)) {
            return true;
          }
        }

        // 4. If no permission was found, deny access.
        return false;
      },

      decodeJwtToken: (token: string) => {
        if (!token) return null;
        try {
          return jwtDecode<UserJwtPayload>(token);
        } catch (error) {
          console.error('Failed to decode JWT:', error);
          return null;
        }
      },

      isAccessExpired: () => {
        const decoded = get().decodeJwtToken(get().token.access);
        if (!decoded?.exp) return true;
        return decoded.exp < Date.now() / 1000;
      },

      isRefreshExpired: () => {
        const decoded = get().decodeJwtToken(get().token.refresh);
        if (!decoded?.exp) return true;
        return decoded.exp < Date.now() / 1000;
      },

      getAccessTimeLeft: () => {
        const decoded = get().decodeJwtToken(get().token.access);
        if (!decoded?.exp) return 0;
        const currentTime = Date.now() / 1000;
        return Math.max(0, decoded.exp - currentTime);
      },

      getRefreshTimeLeft: () => {
        const decoded = get().decodeJwtToken(get().token.refresh);
        if (!decoded?.exp) return 0;
        const currentTime = Date.now() / 1000;
        return Math.max(0, decoded.exp - currentTime);
      },

      isAuthenticated: () => {
        const hasToken = !!get().token.access;
        return hasToken && !get().isAccessExpired();
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        permissions: state.permissions
      })
      // partialize: (state) => ({ token: state.token })
      // onRehydrateStorage: () => (state) => {
      //   if (state) {
      //     state.user = state.decodeJwtToken(state.token.access);
      //   }
      // }
    }
  )
);
