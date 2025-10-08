import type { TenantEntity } from '@/types/api/base/tenant.type';
import { create } from 'zustand';

const initialState = {
  /**
   * UI CONFIGURATIONS
   */
  PAGE_SIZE: 10,
  SEARCH_PAGINATION_LIMIT: 1000,
  CURRENCY: 'ETB',
  TOAST_ERROR_TIMEOUT: 3000,
  TOAST_SUCCESS_TIMEOUT: 1000,
  TOAST_DEFAULT_TIMEOUT: 2000,
  SEARCH_INPUT_DELAY: 400,
  STATUS_CODE_GROUP_VALIDATION: [409, 400],
  STATUS_CODE_GROUP_GENERAL: [401, 402, 403, 404, 500],
  AXIOS_JWT_AUTH_PARAM: 'jwt',
  SCANNER_TERMINATOR: 'Enter',
  SCANNER_DEBOUNCE_TIME: 300,
  UPGRADE_ALERT_TIME: 10 * 1000, // 10 seconds
  JWT_KEY_NAME: 'token',
  user: null,
  SUBDOMAIN_POSITION: 0,
  tenant: null as Partial<TenantEntity> | null
};

type ConfigState = typeof initialState;

type ConfigActions = {
  // A simplified, type-safe action to update a configuration value.
  setConfig: <K extends keyof ConfigState>(
    key: K,
    value: ConfigState[K]
  ) => void;
};

export const useConfigStore = create<ConfigState & ConfigActions>((set) => ({
  ...initialState,
  setConfig: (key, value) => {
    set({ [key]: value });
  }
}));
