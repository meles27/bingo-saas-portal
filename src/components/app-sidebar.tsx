import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal
} from 'lucide-react';
import * as React from 'react';

import { TeamSwitcher } from '@/components/context-switcher';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'react-router-dom';

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  navMain: [
    {
      title: 'Organization',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Credientials',
          url: '/dashboard/users'
        },
        {
          title: 'Roles',
          url: '/dashboard/roles'
        },
        { icon: Settings2, title: 'Games', url: '/dashboard/games' },
        { icon: Settings2, title: 'Transactions', url: '/dashboard/test' },
        { icon: Settings2, title: 'Card Templates', url: '/dashboard/test' },
        { icon: Settings2, title: 'Patterns', url: '/dashboard/patterns' },
        { icon: Settings2, title: 'My Wallet', url: '/dashboard/test' }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userInfo = useAuthStore((state) => state.user);

  const { isMobile, openMobile, toggleSidebar } = useSidebar();
  const location = useLocation();

  React.useEffect(() => {
    if (isMobile && openMobile) {
      toggleSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, location.pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: userInfo?.email || 'N/A',
            name: `${userInfo?.firstName} ${userInfo?.lastName}`,
            avatar: userInfo?.image || ''
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
