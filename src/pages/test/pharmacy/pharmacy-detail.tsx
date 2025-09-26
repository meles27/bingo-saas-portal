import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  Phone,
  Pill,
  Search,
  Star,
  User
} from 'lucide-react';
import React from 'react';

// --- Helper Data & Types ---
interface PharmacyData {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  imageUrl: string;
  contact: {
    phone: string;
    website: string;
  };
  hours: {
    day: string;
    time: string;
  }[];
  availableDrugs: string[];
}

const pharmacyDetails: PharmacyData = {
  name: 'Health First Pharmacy',
  rating: 4.8,
  reviewCount: 123,
  address: '123 Main St, Anytown',
  imageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB7JTPiQP0hM6PM42QYLRqavWmrP6amuXunMbUfvN5-JsjJso_zt_V9M3jGaVD3aeI_YdSqUklxzWLRxqhWBV4AlGfjLY5kCalH9lbK-JrRHqt75HnBQgNpAHzWRMdiDw-WY2EFM2ck0a9eFbawy2UY-qoqzohBMqz3XpzUn0Of0GrlgDsbop7qwjTZbz-4LbPkf0n4k1GnGFIqZRn1htb-5OPJ3uIq6GyWor99-oRietTQShkMVjmo1TWXcrStbOGhizUe3-ioLuNO',
  contact: {
    phone: '(555) 123-4567',
    website: 'healthfirstpharmacy.com'
  },
  hours: [
    { day: 'Monday - Friday', time: '8 AM - 8 PM' },
    { day: 'Saturday', time: '9 AM - 6 PM' },
    { day: 'Sunday', time: 'Closed' }
  ],
  availableDrugs: [
    'Aspirin',
    'Ibuprofen',
    'Acetaminophen',
    'Amoxicillin',
    'Lisinopril',
    'Metformin'
  ]
};

const navItems = [
  { href: '#', icon: Pill, label: 'Pharmacies', active: true },
  { href: '#', icon: Search, label: 'Search' },
  { href: '#', icon: Heart, label: 'Favorites' },
  { href: '#', icon: User, label: 'Profile' }
];

// --- Sub-components ---
const InfoRow: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4">
    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <p className="font-medium">{label}</p>
      <p className="text-sm text-subtle-light dark:text-subtle-dark">{value}</p>
    </div>
  </div>
);

// --- Main Component ---
export const PharmacyDetails: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display text-content-light dark:bg-background-dark dark:text-content-dark">
      <header className="sticky top-0 z-10 border-b border-border-light bg-background-light/80 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" className="-ml-2">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 pr-10 text-center text-lg font-bold">
            Pharmacy Details
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="space-y-8 p-4">
          {/* Pharmacy Info Section */}
          <section className="flex items-start gap-4">
            <div
              className="h-24 w-24 shrink-0 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url("${pharmacyDetails.imageUrl}")` }}
            />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{pharmacyDetails.name}</h2>
              <div className="flex items-center gap-1 text-subtle-light dark:text-subtle-dark">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <p className="text-sm font-medium">
                  {pharmacyDetails.rating} • {pharmacyDetails.reviewCount}{' '}
                  Reviews
                </p>
              </div>
              <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                {pharmacyDetails.address}
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">Contact</h3>
            <Card className="bg-white shadow-sm dark:bg-background-dark/50">
              <CardContent className="p-0">
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={pharmacyDetails.contact.phone}
                />
                <Separator className="bg-border-light dark:bg-border-dark" />
                <InfoRow
                  icon={Globe}
                  label="Website"
                  value={pharmacyDetails.contact.website}
                />
              </CardContent>
            </Card>
          </section>

          {/* Hours Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">Hours</h3>
            <Card className="bg-white p-4 shadow-sm dark:bg-background-dark/50">
              <CardContent className="space-y-3 p-0">
                {pharmacyDetails.hours.map((hourInfo, index) => (
                  <div key={index} className="flex justify-between">
                    <p className="font-medium">{hourInfo.day}</p>
                    <p className="text-subtle-light dark:text-subtle-dark">
                      {hourInfo.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Available Drugs Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">Available Drugs</h3>
            <Card className="overflow-hidden bg-white shadow-sm dark:bg-background-dark/50">
              <CardContent className="p-0">
                {pharmacyDetails.availableDrugs.map((drug, index) => (
                  <React.Fragment key={drug}>
                    <a
                      href="#"
                      className="flex items-center justify-between p-4 transition-colors duration-200 hover:bg-primary/5 dark:hover:bg-primary/10">
                      <p>{drug}</p>
                      <ChevronRight className="h-5 w-5 text-subtle-light dark:text-subtle-dark" />
                    </a>
                    {index < pharmacyDetails.availableDrugs.length - 1 && (
                      <Separator className="mx-4 bg-border-light dark:bg-border-dark" />
                    )}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-border-light bg-background-light/80 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <nav className="flex h-20 items-center justify-around">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                item.active
                  ? 'text-primary'
                  : 'text-subtle-light dark:text-subtle-dark'
              }`}>
              <item.icon
                className={`h-6 w-6 ${item.active ? 'fill-primary' : ''}`}
                strokeWidth={item.active ? 2 : 1.5}
              />
              <p className="text-xs font-medium">{item.label}</p>
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
};
