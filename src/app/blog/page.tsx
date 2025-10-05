"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FullScreenLoader from "@/components/FullScreenLoader";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";
import { splitTitle } from "@/utils/textUtils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type BlogRow = {
  id: string;
  title_am?: string; title_en?: string; title_ru?: string; title_fa?: string;
  content_am?: string; content_en?: string; content_ru?: string; content_fa?: string;
  image_1?: string | null; image_2?: string | null; image_3?: string | null; image_4?: string | null;
  created_at?: string;
};

function toBullets(text: string, maxTotal = 150): string[] {
  if (!text) return [];
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  const bullets: string[] = [];
  let used = 0;
  for (const p of parts) {
    const piece = p.trim();
    if (!piece) continue;
    const remaining = maxTotal - used;
    if (remaining <= 0) break;
    let take = piece;
    if (piece.length > remaining) take = piece.slice(0, Math.max(0, remaining - 1)).trim() + "…";
    bullets.push(take);
    used += take.length;
    if (bullets.length >= 4) break;
  }
  if (bullets.length === 0) bullets.push(cleaned.slice(0, Math.min(maxTotal - 1, cleaned.length)).trim() + (cleaned.length > maxTotal ? "…" : ""));
  return bullets;
}

export default function BlogPage() {
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const [rows, setRows] = useState<BlogRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("blog").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (mounted) setRows(data as BlogRow[]);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load blog");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const lang = resolveLang(i18n.language);

  return (
    <div className='min-h-screen bg-background'>
      {loading && <FullScreenLoader />}
      <Header forceWhite={true} />

      <section className='relative pt-32'>
        <div className='absolute inset-0 -z-10'>
          <img src='/assets/syunik-bg.jpg' className='w-full h-full object-cover' />
          <div className='absolute inset-0 bg-black/70'></div>
        </div>
        <div className='text-center mb-8 animate-fade-in'>
          <div className='section-header'>
            <h2 className='text-4xl md:text-5xl section-header-text' style={{ color: "black" }}>
              {(() => {
                const title = splitTitle(t("blog.blogHeader"));
                return title.hasTwoWords ? (
                  <>
                    {title.firstWord} <span className='accent-word'>{title.restWords}</span>
                  </>
                ) : (
                  title.firstWord
                );
              })()}
            </h2>
          </div>
          <p className='text-lg text-brand-text/70 max-w-2xl mx-auto mt-6'>
            {t("blog.subtitle")}
          </p>
        </div>

        <section className=''>
          <div className='hotel-container'>
            <Button
              onClick={() => router.push("/")}
              className='mb-6 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-brand-text shadow-sm transition-all duration-300 hover:bg-brand-primary hover:text-white hover:shadow-md'
            >
              <ArrowLeft className='w-4 h-4' />
              {t("nav.back_button")}
            </Button>
          </div>
        </section>

        <div className='hotel-container'>
          {/* Error/empty states */}
          {!loading && error && (
            <p className='text-center text-red-500 my-8'>{error}</p>
          )}
          {!loading && !error && (rows?.length ?? 0) === 0 && (
            <p className='text-center text-brand-text/70 my-8'>{t("common.nothing_here", { defaultValue: "Nothing to show yet." })}</p>
          )}

          {/* Desktop / Tablet Grid */}
          <div className='hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {(rows || []).map((row) => {
              const title = pickLocalized(row as any, "title", lang) || "Untitled";
              const content = pickLocalized(row as any, "content", lang) || "";
              const bullets = toBullets(content, 150);
              const img = row.image_1 || "/assets/placeholder.jpg";
              return (
                <BlogCard key={row.id} id={row.id} title={title} image={img} bullets={bullets} />
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className='block md:hidden mb-12'>
            {!loading && !error && (rows || []).length > 0 && (
              <Carousel className='relative' opts={{ align: 'start', loop: true }}>
                <CarouselContent>
                  {(rows || []).map((row) => (
                    <CarouselItem key={row.id} className='basis-full'>
                      <BlogCard
                        id={row.id}
                        title={pickLocalized(row as any, 'title', lang) || 'Untitled'}
                        image={row.image_1 || '/assets/placeholder.jpg'}
                        bullets={toBullets(pickLocalized(row as any, 'content', lang) || '', 150)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='left-2 top-[calc(38%+10px)] -translate-y-1/2 h-12 w-12 rounded-full bg-[#ED5027] text-white shadow-md border-none active:opacity-90 active:scale-95 transition-transform [&_svg]:h-6 [&_svg]:w-6 hover:bg-[#ED5027]' />
                <CarouselNext className='right-2 top-[calc(38%+10px)] -translate-y-1/2 h-12 w-12 rounded-full bg-[#ED5027] text-white shadow-md border-none active:opacity-90 active:scale-95 transition-transform [&_svg]:h-6 [&_svg]:w-6 hover:bg-[#ED5027]' />
              </Carousel>
            )}
          </div>
        </div>
      </section>

      <div className='mt-20'>
        <Footer />
      </div>
    </div>
  );
}
