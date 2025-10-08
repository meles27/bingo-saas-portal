import { urls } from '@/config/urls';
import { useAuthStore } from '@/store/auth-store';
import { useConfigStore } from '@/store/config-store';
import axios from 'axios';

// Structure for the specific 422 validation error item
export type StandardValidationError = {
  field: string;
  messages: string[];
};

// Shape of the API error data payload (flexible)
type ApiErrorData = {
  detail?: string;
  // `errors` can be an array of objects, a plain object, a string, or an array of strings
  errors?:
    | StandardValidationError[]
    | Record<string, unknown>
    | string
    | string[];
};

export interface AxiosBaseQueryErrorResponse {
  status?: number;
  data: ApiErrorData;
  message?: string;
}

// =================================================================
//                      GLOBAL AXIOS INSTANCE
// =================================================================
const globalAxiosInstance = axios.create({
  baseURL: urls.getGlobalBaseUrl(),
  withCredentials: true
});

globalAxiosInstance.interceptors.request.use(
  (config) => {
    // You might have a separate auth mechanism for global users (e.g., superadmins)
    // const globalToken = useGlobalAuthStore.getState().token;
    // if (globalToken) {
    //   config.headers.Authorization = `Bearer ${globalToken.access}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// =================================================================
//                      TENANT AXIOS INSTANCE
// =================================================================
const tenantAxiosInstance = axios.create({
  withCredentials: true
});

/**
 * URLs that don't require an access token for the tenant
 */
const publicTenantUrls = [urls.getAuthTokenUrl(), urls.getTenantSettingsUrl()];

tenantAxiosInstance.interceptors.request.use(
  (config) => {
    const tenant = useConfigStore.getState().tenant;
    const defaultTenantId = '764d0518-6c72-4393-a4d6-31c40992a7b1';

    config.baseURL = urls.getTenantBaseUrl();

    // Your existing logic for tenant-specific headers
    const token = useAuthStore.getState().token;

    if (!publicTenantUrls.includes(config.url || '')) {
      if (token && token?.access) {
        config.headers.Authorization = `Bearer ${token?.access}`;
      }
    }

    config.headers['X-Tenant-ID'] = tenant?.id || defaultTenantId;

    return config;
  },
  (error) => Promise.reject(error)
);

// You can add response interceptors to both instances if needed
tenantAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

globalAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { globalAxiosInstance, tenantAxiosInstance };
