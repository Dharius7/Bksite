import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Rates from '@/components/Rates';
import Services from '@/components/Services';
import About from '@/components/About';
import Promotional from '@/components/Promotional';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Rates />
      <Services />
      <About />
      <Promotional />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
