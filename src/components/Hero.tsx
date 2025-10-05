"use client";

import { Button } from "@/components/ui/button";
import { CustomBookButton } from "@/components/CustomBookButton";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Hero = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const lightsCount = 12;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Respect reduced motion preferences
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const startAnimation = () => {
      // Ensure previous context is cleared before starting a new one
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
      ctxRef.current = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        if (titleRef.current) {
          tl.from(titleRef.current, {
            y: 24,
            duration: 0.6,
            clearProps: "transform"
          });
        }
        if (subtitleRef.current) {
          tl.from(
            subtitleRef.current,
            { y: 18, duration: 0.45, clearProps: "transform" },
            "-=0.35"
          );
        }
        if (ctaGroupRef.current) {
          const children = Array.from(ctaGroupRef.current.children);
          if (children.length) {
            tl.from(
              children,
              { y: 14, duration: 0.35, stagger: 0.05, clearProps: "transform" },
              "-=0.45"
            );
          }
        }
      });
    };

    const onReady = () => {
      startAnimation();
      window.removeEventListener("app:ready", onReady);
    };

    // Start immediately if the app is already ready, otherwise wait for the event
    if ((window as any).__appReady) {
      startAnimation();
    } else {
      window.addEventListener("app:ready", onReady, { once: true } as any);
    }

    return () => {
      window.removeEventListener("app:ready", onReady);
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id='home'
      className='relative h-screen flex items-center justify-center overflow-hidden'
    >
      <div className='absolute inset-0 bg-black/80 z-10 pointer-events-none' />

      <video
        autoPlay
        muted
        loop
        playsInline
        className='absolute inset-0 w-full h-full object-cover z-0 bg-black opacity-0 animate-[fadeIn_1s_ease-in-out_forwards]'
      >
        <source src='/assets/videos/hotel.webm' type='video/webm' />
        <source src='/assets/hotel.mp4' type='video/mp4' />
      </video>

      <div className='absolute inset-0 z-20 pointer-events-none overflow-hidden'>
        {Array.from({ length: lightsCount }).map((_, i) => {
          const size = Math.random() * 6 + 4; // 4px–10px
          const left = Math.random() * 100;
          const duration = Math.random() * 12 + 12; // 12s–24s (slower)
          const startBottom = Math.random() * 100; // Random vertical start in %

          return (
            <div
              key={i}
              className='absolute rounded-full shadow-lg'
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `${startBottom}%`, // random starting vertical position
                backgroundColor: "rgba(237, 80, 39, 0.7)",
                opacity: 1,
                animation: `floatUp ${duration}s linear infinite`,
                animationDelay: `-${Math.random() * duration}s` // randomize initial animation offset
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className='relative z-20 text-center text-white hotel-container'>
        <div className='animate-fade-in'>
          <h1
            ref={titleRef}
            className='text-3xl md:text-5xl font-bold mb-6 leading-tight'
          >
            {t("hero.title")}
          </h1>
          <p
            ref={subtitleRef}
            className='text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light leading-relaxed'
          >
            {t("hero.subtitle")}
          </p>

          <div
            ref={ctaGroupRef}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <Button
              variant='hero'
              size='lg'
              onClick={() => router.push("/rooms")}
              className='min-w-[160px] bg-[hsl(var(--brand-primary))] text-white border-none hover:opacity-90 hover:shadow-md'
            >
              {t("nav.rooms")}
            </Button>
            <Button
              variant='outline-hero'
              size='lg'
              onClick={() => {
                const el = document.getElementById("contact");
                if (!el) return;
                const isMobile = window.innerWidth < 768;
                const headerEl = document.querySelector('header') as HTMLElement | null;
                const headerOffset = (headerEl?.offsetHeight ?? (isMobile ? 60 : 80)) + 4;
                const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              }}
              className='min-w-[160px] border-white text-white hover:bg-white/10 hover:text-white'
            >
              {t("nav.contact")}
            </Button>
          </div>
        </div>
      </div>


      {/* Arrow image pointing to the booking button (desktop only) */}
      <img
        src='/assets/arrows/arrow.png'
        alt=''
        aria-hidden
        className='book-arrow'
      />

      {/* Tailwind keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes floatUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-120vh); }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
