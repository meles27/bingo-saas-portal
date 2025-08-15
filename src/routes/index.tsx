import { ProtectedRoute } from '@/components/auth/protected-route';
import { AnimatePage } from '@/components/base/route-animation/animate-page';
import { RolePermissions } from '@/components/tenant/roles/role-permissions';
import { LoginPage } from '@/pages/base/login-page';
import { NotFound404Page } from '@/pages/base/not-found-404-page';
import { DefaultPage } from '@/pages/dashboard/default-page';
import { BranchesPage } from '@/pages/dashboard/tenant/branches-page';
import { RolesPage } from '@/pages/dashboard/tenant/roles-page';
import { UsersPage } from '@/pages/dashboard/tenant/users-page';
import { HomePage } from '@/pages/site/home-page';
import { TestPage } from '@/pages/test/test-page';
import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { RootLayout } from '../layouts/root-layout';
import { SiteLayout } from '../layouts/site-layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      /**
       * site routes
       */
      {
        path: '/',
        element: <SiteLayout />,
        children: [
          {
            path: '',
            element: <HomePage />
          },
          {
            path: 'login',
            element: <LoginPage />
          },
          {
            path: '*',
            element: <NotFound404Page />
          }
        ]
      },
      /**
       * dashboard routes
       */
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute
            branchId="db1e8a0d-c4d6-47d8-8d49-b21f66ca83ee"
            requiredPermissions={[]}
          />
        ),
        children: [
          {
            path: '',
            element: <DashboardLayout />,
            children: [
              {
                path: '',
                element: <DefaultPage />
              },
              {
                path: 'users',
                element: <UsersPage />
              },
              {
                path: 'roles',
                element: <RolesPage />
              },
              {
                path: 'roles/:roleId/assign-permissions',
                element: <RolePermissions />
              },
              {
                path: 'branches',
                element: <BranchesPage />
              },

              {
                path: 'test',
                element: <TestPage />
              },
              {
                path: '*',
                element: (
                  <AnimatePage>
                    <NotFound404Page />
                  </AnimatePage>
                )
              }
            ]
          }
        ]
      }
    ]
  }
]);

export default router;
