import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // Assumes you have a utility for merging Tailwind classes
import { Heart, Menu, Search, Store, User } from 'lucide-react';
import React, { useState } from 'react';

// --- Helper Data & Types ---
interface Pharmacy {
  name: string;
  address: string;
  isOpen: boolean;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  active?: boolean;
}

const pharmacyData: Pharmacy[] = [
  {
    name: 'Health First Pharmacy',
    address: '123 Main St, Anytown',
    isOpen: true
  },
  {
    name: 'Community Pharmacy',
    address: '456 Oak Ave, Anytown',
    isOpen: false
  },
  { name: 'Wellness Pharmacy', address: '789 Pine Ln, Anytown', isOpen: true },
  { name: 'Care Plus Pharmacy', address: '101 Elm Rd, Anytown', isOpen: true },
  {
    name: 'Family Health Pharmacy',
    address: '222 Maple Dr, Anytown',
    isOpen: false
  }
];

const navItems: NavItem[] = [
  { label: 'Pharmacies', icon: Store, href: '#', active: true },
  { label: 'Search', icon: Search, href: '#' },
  { label: 'Favorites', icon: Heart, href: '#' },
  { label: 'Profile', icon: User, href: '#' }
];

// --- Sub-components ---
const PharmacyListItem: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => (
  <li className="flex cursor-pointer items-center justify-between rounded-lg bg-white/50 p-4 transition-all hover:bg-primary/10 dark:bg-black/20">
    <div className="flex items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Store className="h-6 w-6" />
      </div>
      <div>
        <p className="font-semibold text-sm text-foreground dark:text-foreground">
          {pharmacy.name}
        </p>
        <p className="text-sm text-foreground/70 dark:text-foreground/70">
          {pharmacy.address}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'size-2 rounded-full',
          pharmacy.isOpen
            ? 'bg-primary'
            : 'bg-background-dark/30 dark:bg-background-light/30'
        )}
      />
      <p
        className={cn(
          'text-sm font-medium',
          pharmacy.isOpen
            ? 'text-foreground dark:text-foreground'
            : 'text-foreground/70 dark:text-foreground/70'
        )}>
        {pharmacy.isOpen ? 'Open' : 'Closed'}
      </p>
    </div>
  </li>
);

const BottomNavItem: React.FC<{ item: NavItem }> = ({ item }) => (
  <a
    href={item.href}
    className={cn(
      'flex flex-col items-center gap-1 p-2',
      item.active
        ? 'text-primary'
        : 'text-foreground/60 dark:text-foreground/60'
    )}>
    {item.active ? (
      <div className="flex h-8 w-16 items-center justify-center rounded-full bg-primary/20">
        <item.icon className="h-6 w-6" />
      </div>
    ) : (
      <item.icon className="h-8 w-6" />
    )}
    <p className={cn('text-xs', item.active && 'font-bold')}>{item.label}</p>
  </a>
);

// --- Main Component ---
export const PharmacyPortal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPharmacies = pharmacyData.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col bg-background font-display">
      <header className="flex flex-col p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground dark:text-foreground">
            Pharmacies
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground dark:text-foreground">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
        <div className="relative mt-4">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-5 w-5 text-foreground/50 dark:text-foreground/50" />
          </div>
          <Input
            type="text"
            placeholder="Search for pharmacies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-0 bg-background-light/50 py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/50 focus:ring-1 focus:ring-primary dark:bg-background-dark/50 dark:text-foreground dark:placeholder:text-foreground/50"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4">
        <ul className="space-y-3">
          {filteredPharmacies.map((pharmacy) => (
            <PharmacyListItem key={pharmacy.name} pharmacy={pharmacy} />
          ))}
        </ul>
      </main>

      <nav className="sticky bottom-0 border-t border-background-light/80 bg-background dark:border-background-dark/80">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
          {navItems.map((item) => (
            <BottomNavItem key={item.label} item={item} />
          ))}
        </div>
      </nav>
    </div>
  );
};
