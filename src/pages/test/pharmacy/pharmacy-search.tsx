import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Building,
  Heart,
  Pill,
  Search,
  User,
  XCircle
} from 'lucide-react';
import React, { useState } from 'react';

// --- Helper Data & Types ---
interface Pharmacy {
  name: string;
  address: string;
  imageUrl: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  active?: boolean;
}

const pharmaciesData: Pharmacy[] = [
  {
    name: 'City Pharmacy',
    address: '123 Main St, Anytown',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ0KnhPwoh4LnT4r8S2BSP2OW7fe0Q04Lxunnd-UpP6A5xkhSWbUtohvJiXdGP6ZwUlOT3ImHh7fHfN7vbv6GfBU67eFvBOrHaS0RPXClJIihpZyFEIHcq8HHDR_n8pDmYihn4ZWj_fUrsR30uggUQvnKkWLAaNK_R8L-4fQJNMVSre5zkphe5hnRbqGbHNO7rif8gyAVC-Bqkb0tyOGtilbOxW_dpcXKFA21FDOvl24p1BUtByC8kmFGdN1eL7NIghBWzAl6010IA'
  },
  {
    name: 'Community Pharmacy',
    address: '456 Oak Ave, Anytown',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2mdLYc_PiopY9E-iBXlTUaeMyR9l0Rr5VvjKXWrds5lB4UWaTb96ULkURUSZZHLiXIguXbUjuI0w3zcOuTYV9KbU37DvwA3aE97WkL6T84GkJvHuVN-3wWPzsPMhga_ZfOvVIYvfbsQXgmFsnqVG5BcwF0FlQne1z0RNLXBFjBlKnJIan8pAuygoSFRbMjHZw-EnCjgYZKhsJz0WR1hIttv0oBMk_eXz2lLjC4PkNMRby_KDUk0cT-HGtmZf5XD4SUYeNP6ilZ5xx'
  },
  {
    name: 'Neighborhood Pharmacy',
    address: '789 Pine Ln, Anytown',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAS_eNP51wpQG372dWC-1a57R9eN7ZdV_xEfVmi2CybPKl64dfeqpzbq7fEohgIqyrfLdrez2uWJ9eca-m1-qBDrdbxnVD_UWNoW8_-dj3cy1_WHcksFQnVfP2poD1Mw2eq0iNekYjrEzNdYX9ZMOXLax-F9kBwX_K5ukeCUr3Tr0QK_9un8T93lJkhgL0QBkLVBBukf_Juh_kzCA04-uvWO8ExklSd1Apu6VAbcTtc8ofIibQoRtU8RcnDoL3ccabeSut8hCyf4N6K'
  }
];

const drugsData: string[] = ['Cough Syrup', 'Cough Drops'];

const navItems: NavItem[] = [
  { label: 'Pharmacies', icon: Building, href: '#' },
  { label: 'Search', icon: Search, href: '#', active: true },
  { label: 'Favorites', icon: Heart, href: '#' },
  { label: 'Profile', icon: User, href: '#' }
];

// --- Sub-components ---
const PharmacyCard: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => (
  <div className="flex items-center gap-4 rounded-lg bg-background p-2">
    <div
      className="h-16 w-16 shrink-0 rounded-lg bg-cover bg-center"
      style={{ backgroundImage: `url("${pharmacy.imageUrl}")` }}
    />
    <div className="flex-grow">
      <p className="font-semibold text-content-light dark:text-content-dark">
        {pharmacy.name}
      </p>
      <p className="text-sm text-subtle-light dark:text-subtle-dark">
        {pharmacy.address}
      </p>
    </div>
  </div>
);

const DrugListItem: React.FC<{ drugName: string }> = ({ drugName }) => (
  <div className="flex items-center gap-4 rounded-lg p-2">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
      <Pill className="h-6 w-6" />
    </div>
    <p className="flex-1 font-medium text-content-light dark:text-content-dark">
      {drugName}
    </p>
  </div>
);

// --- Main Component ---
export const PharmacySearch: React.FC = () => {
  const [searchValue, setSearchValue] = useState('Cough Syrup');

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-background font-display">
      <div className="flex-grow pb-24">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center p-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-content-light dark:text-content-dark">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 pr-6 text-center text-lg font-bold text-content-light dark:text-content-dark">
              Search
            </h1>
          </div>
          <div className="px-4 pb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-subtle-light dark:text-subtle-dark" />
              </div>
              <Input
                type="text"
                placeholder="Search drugs & pharmacies"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-full border-0 bg-primary/10 py-3 pl-11 pr-11 text-base font-medium text-content-light placeholder:text-subtle-light focus:ring-2 focus:ring-primary dark:bg-primary/20 dark:text-content-dark dark:placeholder:text-subtle-dark"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchValue('')}
                  className="absolute inset-y-0 right-0 flex items-center rounded-full pr-4 text-subtle-light hover:bg-transparent dark:text-subtle-dark">
                  <XCircle className="h-5 w-5" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="px-4">
          <section className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-content-light dark:text-content-dark">
              Pharmacies
            </h2>
            <div className="space-y-2">
              {pharmaciesData.map((pharmacy) => (
                <PharmacyCard key={pharmacy.name} pharmacy={pharmacy} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-content-light dark:text-content-dark">
              Drugs
            </h2>
            <div className="space-y-2">
              {drugsData.map((drug) => (
                <DrugListItem key={drug} drugName={drug} />
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="sticky bottom-0 border-t border-primary/20 bg-background/80 backdrop-blur-sm">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                item.active
                  ? 'text-primary'
                  : 'text-subtle-light dark:text-subtle-dark'
              }`}>
              <item.icon className="h-6 w-6" fill="currentColor" />
              <span
                className={`text-xs ${
                  item.active ? 'font-bold' : 'font-medium'
                }`}>
                {item.label}
              </span>
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
};
