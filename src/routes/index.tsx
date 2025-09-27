import { RolePermissions } from '@/components/tenant/roles/role-permissions';
import { GameLayout } from '@/layouts/dashboard/game-layout';
import { PrivateLayout } from '@/layouts/dashboard/private-layout'; // ✅ fixed
import { RootLayout } from '@/layouts/root/root-layout';
import { SiteLayout } from '@/layouts/site/site-layout';
import { LoginPage } from '@/pages/base/login-page';
import { NotFound404Page } from '@/pages/base/not-found-404-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { GameDetailPage } from '@/pages/dashboard/tenant/game/game-detail-page';
import { GamesPage } from '@/pages/dashboard/tenant/game/games-page';
import { ParticipantsPage } from '@/pages/dashboard/tenant/game/participants-page';
import { PatternsPage } from '@/pages/dashboard/tenant/game/patterns-page';
import { PlayRoundPage } from '@/pages/dashboard/tenant/game/play-round-page';
import { RoundsPage } from '@/pages/dashboard/tenant/game/rounds-page';
import { RolesPage } from '@/pages/dashboard/tenant/roles-page';
import { UsersPage } from '@/pages/dashboard/tenant/users-page';
import { HomePage } from '@/pages/site/home-page';
import { TestPage } from '@/pages/test/test-page';
import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '../layouts/dashboard/dashboard-layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      /**
       * Public Site Routes
       */
      {
        path: '/',
        element: <SiteLayout />,
        children: [
          {
            index: true,
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
       * Dashboard (Authenticated Area)
       */
      {
        path: 'dashboard',
        element: <PrivateLayout />,
        children: [
          /**
           * Dashboard Home + Subroutes
           */
          {
            path: '',
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardPage />
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
                path: 'games',
                element: <GamesPage />
              },
              {
                path: 'patterns',
                element: <PatternsPage />
              },
              {
                path: 'test',
                element: <TestPage />
              },
              {
                path: '*',
                element: <NotFound404Page />
              }
            ]
          },

          /**
           * Game-specific Routes
           */
          {
            path: 'active-game',
            element: <GameLayout />,
            children: [
              {
                index: true,
                element: <GameDetailPage />
              },
              {
                path: 'rounds',
                element: <RoundsPage />
              },
              {
                path: 'rounds/:roundId/play',
                element: <PlayRoundPage />
              },
              {
                path: 'participants',
                element: <ParticipantsPage />
              },
              {
                path: '*',
                element: <NotFound404Page />
              }
            ]
          }
        ]
      }
    ]
  }
]);

export default router;
