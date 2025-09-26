import { parse } from 'tldts';
import { create } from 'zustand';

const config = {
  /**
   * UI CONFIGURATIONS
   */
  PAGE_SIZE: 40,
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
  SUBDOMAIN_POSITION: 0
};

type ConfigType = typeof config;

type ConfigStore = ConfigType & {
  /**
   * update configuration dynamically
   */
  updateConfigValue: <K extends keyof ConfigType>(
    key: K,
    value: Partial<ConfigType[K]>
  ) => unknown;
  getTenantSubDomain: () => string;
  getTenantNamespace: () => string;
  getPublicNamespace: () => string;
};

export const useConfigStore = create<ConfigStore>((set, get) => ({
  ...config,
  updateConfigValue: async (key, value) => {
    console.log(get);
    set((state) => ({
      ...state,
      [key]: value
    }));
  },
  getTenantSubDomain() {
    let subdomain: string = '';
    const hostname = window.location.hostname;
    const position = get().SUBDOMAIN_POSITION;
    // Use tldts to reliably parse the hostname
    const parsed = parse(hostname, { allowPrivateDomains: true });

    if (parsed.subdomain) {
      const subdomains = parsed.subdomain.split('.');
      if (subdomains.length > position) {
        subdomain = subdomains[position];
      }
    }

    return subdomain;
  },
  getTenantNamespace() {
    return `tenant-${get().getTenantSubDomain()}`;
  },
  getPublicNamespace() {
    return `public-${get().getTenantSubDomain()}`;
  }
}));
