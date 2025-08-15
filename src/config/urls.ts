export const urls = {
  BASE_URL: 'http://${subdomain}localhost.test:3000',
  /**
   * *******************************TENANT SPECIFIC ROUTES ************************
   */
  AUTH_TOKEN_URL: '/api/v1/tenant/auth/token',
  AUTH_REFRESH_TOKEN_URL: '/api/v1/tenant/auth/token/refresh',
  AUTH_FORGET_PASSWORD: '/api/v1/tenant/auth/reset-password',
  AUTH_CONFIRM_FORGET_PASSWORD: '/api/v1/tenant/auth/confirm-reset-password',
  // user handle
  USERS_URL: '/api/v1/tenant/users',
  USER_URL: '/api/v1/tenant/users/:userId',
  ACTIVATE_USER_URL: '/api/v1/tenant/users/:userId/activate',
  CHANGE_USER_STATUS_URL: '/api/v1/tenant/users/:userId/change-status',
  CHANGE_USER_ROLE_URL: '/api/v1/tenant/users/:userId/change-role',
  /**
   * tenant configuration
   */
  TENANT_SETTINGS: '/api/v1/tenant/settings',
  UPGRADE_PLAN: '/api/v1/tenant/settings/upgrade-plan',
  /**
   * roles
   */
  ROLES_URL: '/api/v1/tenant/roles',
  ROLE_URL: '/api/v1/tenant/roles/:roleId',
  ROLE_PERMISSIONS_URL: '/api/v1/tenant/roles/:roleId/permissions',
  /**
   * permissions url
   */
  PERMISSIONS_URL: '/api/v1/tenant/permissions',
  PERMISSION_URL: '/api/v1/tenant/permissions/:permissionId',
  /**
   * branches url
   */
  BRANCHES_URL: '/api/v1/tenant/branches',
  BRANCH_URL: '/api/v1/tenant/branches/:branchId',
  /**
   * GENERAL CONFIGURATION
   */
  DEFAULT_ACCESS_TOKEN: '',
  DEFAULT_REFRESH_TOKEN: '',
  /**
   * FRONTEND PATHS
   */
  USER_LOGIN_REDIRECT: '/',
  ADMIN_LOGIN_REDIRECT: '/dashboard',
  STUFF_LOGIN_REDIRECT: '/scan',
  LOGOUT_REDIRECT: '/signin',

  TENANT_IDENTIFIER: 'subdomain'
};
