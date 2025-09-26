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
  { id: 'lobby', path: '/lobby', title: 'Game Lobby', showBackButton: false },
  {
    id: 'game-room',
    path: '/games/:gameId',
    title: 'Bingo Game',
    showBackButton: true
  },
  {
    id: 'my-cards',
    path: '/my-cards',
    title: 'My Cards',
    showBackButton: true
  },
  { id: 'prizes', path: '/prizes', title: 'Prizes', showBackButton: true },
  {
    id: 'profile',
    path: '/profile',
    title: 'My Profile',
    showBackButton: true
  },
  { id: 'settings', path: '/settings', title: 'Settings', showBackButton: true }
];

const DEFAULT_CONFIG: HeaderConfig = {
  id: 'default',
  title: 'Pharmacy App',
  showBackButton: false,
  path: '*'
};

/**
 * Hook: returns dynamic header config based on the current route
 */
export const useDynamicHeader = (): HeaderConfig => {
  const { pathname } = useLocation();

  return useMemo(() => {
    const match = PATH_CONFIG.find((config) =>
      matchPath({ path: config.path, end: true }, pathname)
    );
    return match ?? DEFAULT_CONFIG;
  }, [pathname]);
};
