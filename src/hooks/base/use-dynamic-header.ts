import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

export interface HeaderConfig {
  id: string;
  path: string; // React Router style
  title: string;
  showBackButton: boolean;
}

// Bingo app route config
export const PATH_CONFIG: HeaderConfig[] = [
  // Public / Non-auth pages
  { id: 'home', path: '/', title: 'Bingo Hub', showBackButton: false },
  { id: 'about', path: '/about', title: 'About Bingo', showBackButton: true },
  { id: 'rules', path: '/rules', title: 'Game Rules', showBackButton: true },
  { id: 'login', path: '/login', title: 'Login', showBackButton: false },
  {
    id: 'register',
    path: '/register',
    title: 'Register',
    showBackButton: true
  },
  {
    id: 'leaderboard',
    path: '/leaderboard',
    title: 'Leaderboard',
    showBackButton: true
  },

  // Authenticated / Player pages

  {
    id: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    showBackButton: false
  },
  {
    id: 'search',
    path: '/dashboard/search',
    title: 'Search',
    showBackButton: false
  },
  {
    id: 'games',
    path: '/dashboard/games',
    title: 'Bingo Games',
    showBackButton: false
  },

  // game related start
  {
    id: 'game',
    path: '/dashboard/active-game',
    title: 'Bingo Game',
    showBackButton: true
  },

  {
    id: 'participants',
    path: '/dashboard/active-game/participants',
    title: 'Game Participants',
    showBackButton: true
  },

  {
    id: 'rounds',
    path: '/dashboard/active-game/rounds',
    title: 'Game Rounds',
    showBackButton: true
  },
  // game related end

  {
    id: 'prizes',
    path: '/dashboard/active-game/prizes',
    title: 'Prizes',
    showBackButton: true
  },
  {
    id: 'profile',
    path: '/dashboard/profile',
    title: 'My Profile',
    showBackButton: true
  },
  {
    id: 'settings',
    path: '/dashboard/settings',
    title: 'Settings',
    showBackButton: true
  },
  {
    id: 'wallet',
    path: '/dashboard/my-wallet',
    title: 'Wallet',
    showBackButton: true
  }
];

const DEFAULT_CONFIG: HeaderConfig = {
  id: 'default',
  title: 'Pharmacy App',
  showBackButton: false,
  path: '*'
};

export const useDynamicHeader = (): HeaderConfig => {
  const { pathname } = useLocation();

  return useMemo(() => {
    const match = PATH_CONFIG.find((config) =>
      matchPath({ path: config.path, end: true }, pathname)
    );
    return match ?? DEFAULT_CONFIG;
  }, [pathname]);
};
