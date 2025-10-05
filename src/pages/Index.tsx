import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Reviews } from "@/components/Reviews";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (!hash) return;
    const id = hash.replace("#", "");

    const scrollOnce = () => {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return true;
      }
      const element = document.getElementById(id);
      if (!element) return false;
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const headerEl = document.querySelector('header') as HTMLElement | null;
        const headerOffset = (headerEl?.offsetHeight ?? 60) + 4;
        const y = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: "auto" });
      } else {
        element.scrollIntoView({ behavior: "auto", block: "start" });
      }
      return true;
    };

    const timeouts: number[] = [];
    const attempts = [0, 100, 200, 400, 800, 1200];
    attempts.forEach((delay) => {
      const t = window.setTimeout(() => {
        scrollOnce();
      }, delay);
      timeouts.push(t as unknown as number);
    });

    return () => {
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [router.asPath]);

  return (
    <div className='min-h-screen'>
      <Header />
      <Hero />
      <RoomsSection />
      <ServicesSection />
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
