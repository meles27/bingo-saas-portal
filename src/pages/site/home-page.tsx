import withAnimation from '@/components/base/route-animation/with-animation';
import { Cta } from '@/components/site/Cta';
import { Features } from '@/components/site/Features';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';

export const HomePage = withAnimation(() => {
  return (
    <div>
      <Header />
      <main className="w-full max-w-[960px] m-auto">
        <Hero />
        <Features />
        <Cta />
      </main>
      <Footer />
    </div>
  );
});
