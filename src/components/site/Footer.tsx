import { Rocket, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <a
              href="#"
              className="flex items-center gap-2 font-bold text-xl mb-4">
              <Rocket className="h-6 w-6 text-primary" />
              StartPortal
            </a>
            <p className="text-muted-foreground">
              Your journey to a perfect web app starts here.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground">
                  Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground">
                <Twitter />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground">
                <Github />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>
            © {new Date().getFullYear()} StartReactPortal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
