import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useVisibilityManager } from '@/hooks/base/use-visibility-control';
import { useAuthStore } from '@/store/authStore';
import {
  Bell,
  CreditCard,
  Download,
  Home,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Package,
  Settings,
  User,
  Users
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Logout } from './auth/logout';

interface DashboardHeaderProps {
  /**
   * The component to render as a trigger for the sidebar, typically a hamburger menu button.
   */
  children: React.ReactNode;
}
/**
 * A reusable component for items in the Apps grid dropdown.
 */
const GridMenuItem = ({
  href,
  icon: Icon,
  title
}: {
  href: string;
  icon: React.ElementType;
  title: string;
}) => (
  <Link
    to={href}
    className="flex flex-col items-center justify-center gap-2 rounded-md p-3 text-center text-sm hover:bg-accent">
    <Icon className="h-6 w-6 text-muted-foreground" />
    <span>{title}</span>
  </Link>
);

const DashboardHeader: React.FC<DashboardHeaderProps> = (props) => {
  const user = useAuthStore((state) => state.user);
  const { actions, states } = useVisibilityManager(['logout']);
  console.log(props);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="px-4 py-2.5 lg:px-6">
        <div className="flex items-center justify-between">
          {/* for shadcn-ui side bar trigger <SidebarTrigger/> */}
          <span className="max-w-16"> {props.children}</span>

          {/* Right Side: Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Export Button */}
            <Button size="sm" className="hidden items-center gap-2 sm:flex">
              <Download className="h-4 w-4" />
              Export Report
            </Button>

            {/* Home Link */}
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
                <span className="sr-only">Go to Homepage</span>
              </Button>
            </Link>

            {/* Apps Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <LayoutGrid className="h-5 w-5" />
                  <span className="sr-only">Open apps</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <div className="grid grid-cols-3 gap-2">
                  <GridMenuItem
                    href="/dashboard/sales"
                    icon={Users}
                    title="Sales"
                  />
                  <GridMenuItem
                    href="/dashboard/products"
                    icon={Package}
                    title="Products"
                  />
                  <GridMenuItem
                    href="/dashboard/profile"
                    icon={User}
                    title="Profile"
                  />
                  <GridMenuItem
                    href="/dashboard/settings"
                    icon={Settings}
                    title="Settings"
                  />
                  <GridMenuItem
                    href="/dashboard/billing"
                    icon={CreditCard}
                    title="Billing"
                  />
                  <GridMenuItem
                    href="/dashboard/support"
                    icon={LifeBuoy}
                    title="Support"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                  </span>
                  <span className="sr-only">Open notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">New message</p>
                    <p className="text-xs text-muted-foreground">
                      From Jane Doe: "Hey, are we still on for the meeting?"
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SYS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">System Update</p>
                    <p className="text-xs text-muted-foreground">
                      Your plan has been successfully upgraded to Pro.
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={user?.image || ''}
                      alt={user?.lastName || ''}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => actions.open('logout')}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* logout alert */}
            <Logout
              open={states.logout}
              onOpenChange={(open) => actions.set('logout', open)}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardHeader;
