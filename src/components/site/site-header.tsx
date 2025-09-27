import { Button } from '@/components/ui/button';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { cn } from '@/lib/utils'; // The 'cn' utility is crucial for conditional classes
import { Menu, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteLogo } from '../base/site-logo';
import { ModeToggle } from '../mode-toggle';

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#contact', label: 'Contact' }
  ];

  useOnClickOutside(headerRef, () => {
    setIsMenuOpen(false);
  });

  const handleSignin = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  const handleSignup = () => {
    setIsMenuOpen(false);
    navigate('/signup');
  };
  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 left-0 px-6 w-full z-50 transition-all duration-300 bg-background'
      )}>
      <div className="container mx-auto flex h-20 items-center justify-between">
        <SiteLogo logoText="Alpha Betting" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" onClick={handleSignin}>
            Log In
          </Button>
          <Button variant="default" onClick={handleSignup}>
            Sign Up
          </Button>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button variant="ghost" onClick={handleSignin}>
                Log In
              </Button>
              <Button variant="default" onClick={handleSignup}>
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
