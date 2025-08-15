import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="pt-32 pb-20 text-center">
      <div className="container">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          Build Your React Portal, Faster Than Ever
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          The ultimate starting point for your next React project. TypeScript,
          modern components, and best practices included.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Get Started for Free</Button>
          <Button size="lg" variant="outline">
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
