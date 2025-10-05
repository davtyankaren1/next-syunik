"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { splitTitle } from "@/utils/textUtils";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import FullScreenLoader from "@/components/FullScreenLoader";
import BackButton from "@/components/BackButton";
import { useRouter, usePathname } from "next/navigation";

const GOOGLE_IFRAME_SRC = "https://f254627a29ac4fd18331a0f3d00dd454.elf.site";

export default function ReviewsPage() {
  
  const [googleLoading, setGoogleLoading] = useState(true);
  const [elfsightReady, setElfsightReady] = useState(false);
  const [yandexReady, setYandexReady] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { t } = useTranslation();

  useScrollToTop();

  // Load Elfsight platform script once for booking widget
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://elfsightcdn.com/platform.js"]');
    if (existing) {
      setElfsightReady(true);
      // Re-init if global exists
      // @ts-ignore
      if (window.eapps) {
        try {
          // @ts-ignore
          window.eapps.init();
        } catch {}
      }
      return;
    }
    const s = document.createElement("script");
    s.src = "https://elfsightcdn.com/platform.js";
    s.async = true;
    s.onload = () => setElfsightReady(true);
    document.body.appendChild(s);
    return () => {
      // keep script for other navigations; no cleanup
    };
  }, []);

  // Load MyReviews script once and initialize Yandex widget
  useEffect(() => {
    const src = "https://myreviews.dev/widget/dist/index.js";
    let initialized = false;
    const tryInit = () => {
      // @ts-ignore
      if (window.myReviews && window.myReviews.BlockWidget && !initialized) {
        try {
          initialized = true;
          // @ts-ignore
          new window.myReviews.BlockWidget({
            uuid: "ee3dc7ae-2de5-4b03-afe3-157705c1ca77",
            name: "g11149585",
            additionalFrame: "none",
            lang: "ru",
            widgetId: "1",
          }).init();
          setYandexReady(true);
        } catch (e) {
          // retry shortly if init failed
          initialized = false;
          setTimeout(tryInit, 300);
        }
      }
    };

    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      // If script exists but global may not be ready yet, try init after a tick
      setTimeout(tryInit, 0);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.defer = true;
    s.onload = () => {
      tryInit();
    };
    document.body.appendChild(s);
  }, []);

  // Ensure page starts at top when navigating to /reviews without an anchor
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  // Control fullscreen page loader: hide shortly after mount; widgets keep their own inline loaders
  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background mt-4">
      {pageLoading && <FullScreenLoader />}
      <Header forceWhite />
      {/* Spacer to offset fixed header height */}
      <div className="h-[60px] md:h-[80px]" />
      <main className="pb-20 pt-4">
        <div className="hotel-container">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton onClick={() => router.push("/")} label="Go Home" />
          </div>

          {/* Section Header (matches site sections) */}
          <div className='text-center mb-10 animate-fade-in'>
            <div className='section-header'>
              <h2 className='text-3xl md:text-4xl section-header-text'>
                {(() => {
                  const title = splitTitle(t("reviews.title"));
                  return title.hasTwoWords ? (
                    <>
                      {title.firstWord}{" "}
                      <span className='block md:inline accent-word'>
                        {title.restWords}
                      </span>
                    </>
                  ) : (
                    title.firstWord
                  );
                })()}
              </h2>
            </div>
            <p className='text-lg text-brand-text/70 max-w-2xl mx-auto mt-6'>
              {t("reviews.subtitle")}
            </p>
          </div>

          <div className="space-y-10">
            {/* Google */}
            <section id="google" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/media-icons/google-logo.png" alt="Google" className="h-8 w-auto" />
                <h2 className="text-xl font-semibold">Google Reviews</h2>
              </div>
              <div className="relative">
                {googleLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
                  </div>
                )}
                <iframe
                  src={GOOGLE_IFRAME_SRC}
                  width="100%"
                  height="600"
                  style={{ border: 0, borderRadius: "0.5rem" }}
                  allowFullScreen
                  loading="lazy"
                  title="Google Reviews"
                  className="transition-shadow duration-300"
                  onLoad={() => setGoogleLoading(false)}
                ></iframe>
              </div>
            </section>

            {/* Booking.com */}
            <section id="booking" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/media-icons/booking-logo.png" alt="Booking.com" className="h-8 w-auto" />
                <h2 className="text-xl font-semibold">Booking.com Reviews</h2>
              </div>
              <div className="relative min-h-64">
                {!elfsightReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
                  </div>
                )}
                {/* Elfsight widget container */}
                <div className="elfsight-app-6a6825a2-38c6-4fd4-a810-e7c8e2f51e49" data-elfsight-app-lazy></div>
              </div>
            </section>

            {/* Yandex */}
            <section id="yandex" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-28">
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/media-icons/yandex-logo.png" alt="Yandex" className="h-8 w-auto" />
                <h2 className="text-xl font-semibold">Yandex Reviews</h2>
              </div>
              <div className="relative">
                {!yandexReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, borderRadius: 20 }}>
                  <iframe
                    title="Виджет с отзывами «Карусель» от MyReviews"
                    style={{ width: '100%', height: '100%', maxWidth: 1170, border: 'none', outline: 'none', padding: 0, margin: 0, minHeight: 600 }}
                    id="myReviews__block-widget"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
