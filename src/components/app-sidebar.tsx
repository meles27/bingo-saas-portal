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
  SidebarRail
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';

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
          title: 'Branches',
          url: '/dashboard/branches'
        },
        {
          title: 'Credientials',
          url: '/dashboard/users'
        },
        {
          title: 'Roles',
          url: '/dashboard/roles'
        },
        {
          title: 'Test',
          url: '/dashboard/test'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Theme',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userInfo = useAuthStore((state) => state.user);
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
            name: `${userInfo?.first_name} ${userInfo?.last_name}`,
            avatar: userInfo?.image || ''
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
