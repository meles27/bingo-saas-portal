import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveManager } from '@/hooks/base/use-active-manager';
import { cn } from '@/lib/utils'; // Standard shadcn-ui utility
import { Heart, List, Map, Menu, Search, Store, User } from 'lucide-react';
import React, { useState } from 'react';

// --- Data & Types ---

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  position: { top: string; left: string };
}

const PHARMACIES: readonly Pharmacy[] = [
  {
    id: 'health-first',
    name: 'Health First Pharmacy',
    address: '123 Main St, Anytown',
    position: { top: '25%', left: '30%' }
  },
  {
    id: 'community',
    name: 'Community Pharmacy',
    address: '456 Oak Ave, Anytown',
    position: { top: '50%', left: '55%' }
  },
  {
    id: 'wellness',
    name: 'Wellness Pharmacy',
    address: '789 Pine Ln, Anytown',
    position: { top: '60%', left: '20%' }
  }
];
const PHARMACY_IDS = PHARMACIES.map((p) => p.id);

const NAV_ITEMS = ['pharmacies', 'search', 'favorites', 'profile'] as const;
const VIEW_MODES = ['map', 'list'] as const;

// --- Sub-components ---

const PharmacyPin: React.FC<{
  pharmacy: Pharmacy;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ pharmacy, isSelected, onSelect }) => {
  if (isSelected) {
    return (
      <div className="relative" style={pharmacy.position}>
        {/* Info Window */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white p-3 shadow-lg dark:bg-background-dark">
          <p className="font-bold text-background-dark dark:text-background-light">
            {pharmacy.name}
          </p>
          <p className="text-sm text-background-dark/70 dark:text-background-light/70">
            {pharmacy.address}
          </p>
          {/* Tooltip Arrow */}
          <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 bg-white dark:bg-background-dark"></div>
        </div>
        {/* Large Pin */}
        <button
          onClick={onSelect}
          className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary shadow-xl">
          <Store className="h-7 w-7 text-white" />
        </button>
      </div>
    );
  }

  // Standard Pin
  return (
    <div className="absolute" style={pharmacy.position}>
      <button
        onClick={onSelect}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary shadow-md">
        <Store className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

// --- Main Component ---
export const PharmacyMapView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Hook 1: Manage the view mode (Map vs. List)
  const { activeKey: viewMode, actions: viewActions } = useActiveManager(
    VIEW_MODES,
    'map'
  );

  // Hook 2: Manage the selected pharmacy on the map
  const { activeKey: selectedPharmacy, actions: pharmacyActions } =
    useActiveManager(PHARMACY_IDS, 'wellness');

  return (
    <div className="flex h-screen flex-col bg-background font-display">
      {/* Header */}
      <header className="flex flex-col p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-background-dark dark:text-background-light">
            Pharmacies
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-background-dark dark:text-background-light">
            <Menu />
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-background-dark/50 dark:text-background-light/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for pharmacies"
            className="w-full rounded-lg border-0 bg-background-light/50 py-3 pl-10 pr-4 text-background-dark placeholder:text-background-dark/50 focus:ring-1 focus:ring-primary dark:bg-background-dark/50 dark:text-background-light dark:placeholder:text-background-light/50"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1">
        {/* Floating Action Buttons */}
        <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2">
          <Button
            size="icon"
            onClick={() => viewActions.set('map')}
            className={cn(
              'h-12 w-12 rounded-full shadow-lg',
              viewMode !== 'map' &&
                'bg-white text-background-dark dark:bg-black/50 dark:text-background-light'
            )}>
            <Map />
          </Button>
          <Button
            size="icon"
            onClick={() => viewActions.set('list')}
            className={cn(
              'h-12 w-12 rounded-full shadow-lg',
              viewMode !== 'list' &&
                'bg-white text-background-dark dark:bg-black/50 dark:text-background-light'
            )}>
            <List />
          </Button>
        </div>

        {/* Map View */}
        <div className="absolute inset-0 h-full w-full">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADro3H38-9QLxoHdFdNb42VwZyEt4iWBDNZLldWRsTCA_TtdqznDoKD5l5JUT_4CIXzNlsS7X7LphgKGBKukdGC8Uu_4xXF9vNywwkc9wMHG-ityRrwBS5c70kBVtITOr52Thh_4MVcXh-EW914YiHHYgY2WWfpDX-ZuZiL-B6FztVCBQ04U5GWhvK8UwxNgmUVhcqhdxsqvwnTWnu1G8XbkRWiTfmKob_udOjczq9mFe0EKEHtQul_voDwIpo4HiuUJZPiTYuLDcD"
            alt="Map with pharmacy locations"
            className="h-full w-full object-cover"
          />
          {/* Pharmacy Pins */}
          {PHARMACIES.map((pharmacy) => (
            <PharmacyPin
              key={pharmacy.id}
              pharmacy={pharmacy}
              isSelected={selectedPharmacy === pharmacy.id}
              onSelect={() => pharmacyActions.set(pharmacy.id)}
            />
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t border-background-light/80 bg-background dark:border-background-dark/80">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
          {/* You could also manage this with another useActiveManager instance */}
          <a
            href="#"
            className="flex flex-col items-center gap-1 p-2 text-primary">
            <div className="flex h-8 w-16 items-center justify-center rounded-full bg-primary/20">
              <Store className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold">Pharmacies</p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1 p-2 text-background-dark/60 dark:text-background-light/60">
            <Search className="h-8" />
            <p className="text-xs">Search</p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1 p-2 text-background-dark/60 dark:text-background-light/60">
            <Heart className="h-8" />
            <p className="text-xs">Favorites</p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center gap-1 p-2 text-background-dark/60 dark:text-background-light/60">
            <User className="h-8" />
            <p className="text-xs">Profile</p>
          </a>
        </div>
      </nav>
    </div>
  );
};
