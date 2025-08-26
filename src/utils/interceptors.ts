import { urls } from '@/config/urls';
import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true
});

/**
 * urls that doesn't required access token
 */
const publicUrls = [urls.getAuthTokenUrl(), urls.getTenantSettingsUrl()];

axiosInstance.interceptors.request.use(
  (config) => {
    /**
     * get tenant subdomain from configuration
     */
    const subdomain = useConfigStore.getState().getTenantSubDomain();
    config.baseURL = urls.getBaseUrl(subdomain);

    console.log(
      'the current request is ',
      `${config.baseURL}${config.url ? config.url : ''}${
        config.auth ? config.auth : ''
      }`,
      config.params
    );
    const token = useAuthStore.getState().token;

    if (!publicUrls.includes(config.url || '')) {
      if (token && token?.access) {
        config.headers.Authorization = `Bearer ${token?.access}`;
      }
    }
    /**
     * set tenant id
     */
    config.headers['X-Tenant-ID'] = 'ff1411a8-c93e-4f2e-b39d-8177e01c6986';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
