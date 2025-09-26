import withAnimation from '@/components/base/route-animation/with-animation';
import { Cta } from '@/components/site/Cta';
import { Features } from '@/components/site/Features';
import { Footer } from '@/components/site/Footer';
import { Hero } from '@/components/site/Hero';

export const HomePage = withAnimation(() => {
  return (
    <div>
      <main className="w-full max-w-[960px] m-auto px-6">
        <Hero />
        <Features />
        <Cta />
      </main>
      <Footer />
    </div>
  );
});
