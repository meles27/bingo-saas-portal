import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Zap, ShieldCheck, Code } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8 mb-4 text-primary" />,
    title: 'Blazing Fast',
    description:
      'Built on Vite for instant server start and lightning-fast HMR.'
  },
  {
    icon: <ShieldCheck className="h-8 w-8 mb-4 text-primary" />,
    title: 'TypeScript Ready',
    description:
      'Enjoy type safety out-of-the-box for more robust and maintainable code.'
  },
  {
    icon: <Code className="h-8 w-8 mb-4 text-primary" />,
    title: 'Developer Friendly',
    description:
      'Clean, organized codebase with shadcn/ui for ultimate customizability.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/40">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose StartReactPortal?
          </h2>
          <p className="text-muted-foreground mt-2">
            Everything you need to ship your next big idea.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center p-6">
              <div className="flex justify-center">{feature.icon}</div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
