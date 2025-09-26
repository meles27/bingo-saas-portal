import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Heart, MapPin, Pill, Search, User } from 'lucide-react';

// --- Helper Data & Types ---
interface CheckboxItem {
  id: string;
  label: string;
  defaultChecked: boolean;
}

interface PharmacyAvailability {
  name: string;
  inStock: boolean;
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const drugInfo = {
  name: 'Ibuprofen',
  description:
    'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever. It works by blocking the production of prostaglandins, substances in the body that cause pain, fever, and inflammation.',
  uses: [
    {
      id: 'use-pain',
      label: 'Relief of mild to moderate pain',
      defaultChecked: true
    },
    { id: 'use-fever', label: 'Reduction of fever', defaultChecked: true },
    {
      id: 'use-inflammation',
      label: 'Treatment of inflammation',
      defaultChecked: false
    }
  ],
  sideEffects: [
    { id: 'se-stomach', label: 'Stomach upset', defaultChecked: false },
    { id: 'se-nausea', label: 'Nausea', defaultChecked: false },
    { id: 'se-dizziness', label: 'Dizziness', defaultChecked: false }
  ],
  availability: [
    { name: 'Pharmacy A', inStock: true },
    { name: 'Pharmacy B', inStock: false }
  ]
};

const navItems: NavItem[] = [
  { href: '#', icon: Pill, label: 'Pharmacies', active: true },
  { href: '#', icon: Search, label: 'Search' },
  { href: '#', icon: Heart, label: 'Favorites' },
  { href: '#', icon: User, label: 'Profile' }
];

// --- Sub-components ---
const CheckboxGroup: React.FC<{ title: string; items: CheckboxItem[] }> = ({
  title,
  items
}) => {
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <Label
            key={item.id}
            className="flex items-center space-x-3 font-normal">
            <Checkbox
              id={item.id}
              defaultChecked={item.defaultChecked}
              className="h-5 w-5 rounded border-gray-300 bg-transparent text-primary data-[state=checked]:bg-primary data-[state=checked]:border-transparent focus:ring-primary/50 dark:border-gray-600"
            />
            <span className="text-base">{item.label}</span>
          </Label>
        ))}
      </div>
    </div>
  );
};

const AvailabilityCard: React.FC<{ pharmacy: PharmacyAvailability }> = ({
  pharmacy
}) => (
  <Card className="flex flex-row items-center gap-4 bg-white p-4 shadow-sm dark:bg-background ">
    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <MapPin className="h-6 w-6" />
    </div>
    <div className="flex-1">
      <p className="text-base font-medium text-black dark:text-white">
        {pharmacy.name}
      </p>
      {pharmacy.inStock ? (
        <p className="text-sm font-medium text-primary">In Stock</p>
      ) : (
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Out of Stock
        </p>
      )}
    </div>
  </Card>
);

// --- Main Component ---
export const DrugDetail: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background font-display text-black dark:text-white">
      <div className="flex-grow">
        <header className="sticky top-0 z-10 flex items-center bg-background p-4">
          <Button variant="ghost" size="icon" className="p-2">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 pr-10 text-center text-lg font-bold">
            Drug Details
          </h1>
        </header>

        <main className="px-4 pb-24 space-y-4">
          <h2 className="mb-2 mt-4 text-2xl font-bold">{drugInfo.name}</h2>
          <p className="mb-6 text-base text-gray-600 dark:text-gray-300">
            {drugInfo.description}
          </p>

          <div className="space-y-6">
            <CheckboxGroup title="Uses" items={drugInfo.uses} />
            <CheckboxGroup title="Side Effects" items={drugInfo.sideEffects} />

            <div>
              <h3 className="mb-4 text-lg font-bold">Availability</h3>
              <div className="space-y-4">
                {drugInfo.availability.map((pharmacy) => (
                  <AvailabilityCard key={pharmacy.name} pharmacy={pharmacy} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-background dark:border-gray-800">
        <nav className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex w-1/4 flex-col items-center justify-center gap-1 ${
                item.active
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
              }`}>
              <item.icon className="h-6 w-6" fill="currentColor" />
              <span className="text-xs font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
};
