export const urls = {
  // Base URL Generators
  getBaseUrl: (subdomain?: string) =>
    `http://${subdomain ? subdomain + '.' : ''}localhost.test:3000`,

  getSockBaseUrl: (subdomain?: string, namespace?: string) =>
    `http://${subdomain ? subdomain + '.' : ''}localhost.test:3000/${
      namespace ? namespace : ''
    }`,

  /**
   * =================================================================
   *                     TENANT SPECIFIC API ENDPOINTS
   * =================================================================
   */

  // Auth
  getAuthTokenUrl: () => '/api/v1/tenant/auth/token',
  getAuthRefreshTokenUrl: () => '/api/v1/tenant/auth/token/refresh',
  getAuthForgetPasswordUrl: () => '/api/v1/tenant/auth/reset-password',
  getAuthConfirmForgetPasswordUrl: () =>
    '/api/v1/tenant/auth/confirm-reset-password',

  // Users
  getUsersUrl: () => '/api/v1/tenant/users',
  getUserUrl: (userId: string) => `/api/v1/tenant/users/${userId}`,
  getActivateUserUrl: (userId: string) =>
    `/api/v1/tenant/users/${userId}/activate`,
  getChangeUserStatusUrl: (userId: string) =>
    `/api/v1/tenant/users/${userId}/change-status`,
  getChangeUserRoleUrl: (userId: string) =>
    `/api/v1/tenant/users/${userId}/change-role`,

  // Tenant Settings
  getTenantSettingsUrl: () => '/api/v1/tenant/settings',
  getUpgradePlanUrl: () => '/api/v1/tenant/settings/upgrade-plan',

  // Roles
  getRolesUrl: () => '/api/v1/tenant/roles',
  getRoleUrl: (roleId: string) => `/api/v1/tenant/roles/${roleId}`,
  getRolePermissionsUrl: (roleId: string) =>
    `/api/v1/tenant/roles/${roleId}/permissions`,

  // Permissions
  getPermissionsUrl: () => '/api/v1/tenant/permissions',
  getPermissionUrl: (permissionId: string) =>
    `/api/v1/tenant/permissions/${permissionId}`,

  /**
   * *************************** game related settings *********************
   */

  //game games
  getGamesUrl: () => '/api/v1/tenant/games',
  getGameUrl: (gameId: string) => `/api/v1/tenant/games/${gameId}`,

  //game patterns
  getRoundsUrl: () => `/api/v1/tenant/rounds`,
  getRoundUrl: (roundId: string) => `/api/v1/tenant/rounds/${roundId}`,

  //game patterns
  getPatternsUrl: () => '/api/v1/tenant/patterns',
  getPatternUrl: (patternId: string) => `/api/v1/tenant/patterns/${patternId}`,

  /**
   * =================================================================
   *                      STATIC CONFIGURATION VALUES
   * =================================================================
   */
  DEFAULT_ACCESS_TOKEN: '',
  DEFAULT_REFRESH_TOKEN: '',

  // Frontend Paths
  USER_LOGIN_REDIRECT: '/',
  ADMIN_LOGIN_REDIRECT: '/dashboard',
  STUFF_LOGIN_REDIRECT: '/scan',
  LOGOUT_REDIRECT: '/signin',

  // Tenant Identifier
  TENANT_IDENTIFIER: 'subdomain',

  // currency options
  CurrencyOptions: ['ETB', 'USD', 'EUR', 'GBP']
};
