import { Button } from '@/components/ui/button';

export function Cta() {
  return (
    <section id="contact" className="py-20">
      <div className="container">
        <div className="bg-primary/10 rounded-lg p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Dive In?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start building your project today. No credit card required. It's
            free and open source.
          </p>
          <Button size="lg">Create Your Portal Now</Button>
        </div>
      </div>
    </section>
  );
}
