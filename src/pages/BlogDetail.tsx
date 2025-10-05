import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import FullScreenLoader from "@/components/FullScreenLoader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/router";
import { resolveLang, pickLocalized } from "@/utils/i18nSupabase";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import BackButton from "@/components/BackButton";

export type BlogRow = {
  id: string;
  title_am?: string; title_en?: string; title_ru?: string; title_fa?: string;
  content_am?: string; content_en?: string; content_ru?: string; content_fa?: string;
  image_1?: string | null; image_2?: string | null; image_3?: string | null; image_4?: string | null;
  created_at?: string;
};

const BlogDetail = () => {
  const router = useRouter();
  const { id } = (router.query as { id?: string });
  const { i18n, t } = useTranslation();
  const [row, setRow] = useState<BlogRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useScrollToTop();

  // Refs for entrance animations
  const headerRef = useRef<HTMLDivElement | null>(null);
  const backBtnRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const asideImageRefs = useRef<HTMLImageElement[]>([]);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("blog")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        if (mounted) setRow(data as BlogRow);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load blog");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Light GSAP animations when data is ready (must be declared before any early returns)
  useEffect(() => {
    if (!row) return;
    const ctx = gsap.context(() => {
      if (backBtnRef.current) {
        gsap.fromTo(
          backBtnRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
        );
      }

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", delay: 0.06 }
        );
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", delay: 0.14 }
        );
      }

      const imgs = asideImageRefs.current.filter(Boolean);
      if (imgs.length) {
        gsap.fromTo(
          imgs,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.07, delay: 0.16 }
        );
      }
    }, articleRef);
    return () => ctx.revert();
  }, [row?.id]);

  if (loading) return <FullScreenLoader />;
  if (error || !row) return (
    <div className='min-h-screen bg-background'>
      <Header forceWhite={true} />
      <section className='pt-28 pb-20'>
        <div className='hotel-container'>
          <p className='text-center text-red-500'>{error || "Not found"}</p>
        </div>
      </section>
      <Footer />
    </div>
  );

  const lang = resolveLang(i18n.language);
  const title = pickLocalized(row as any, "title", lang) || "Untitled";
  const content = pickLocalized(row as any, "content", lang) || "";

  const images = [row.image_1, row.image_2, row.image_3, row.image_4].filter(Boolean) as string[];


  return (
    <div className='min-h-screen bg-background'>
      <Header forceWhite={true} />
      <article className='relative pt-24 pb-20' ref={articleRef}>
        {/* Hero */}
        <div className="relative h-[180px] md:h-[260px] -mt-2">
          <div className="relative w-full h-full">
            <img
              src={row.image_1 || "/assets/placeholder.jpg"}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-[rgba(255,69,0,0.41)]  bg-opacity-50 flex justify-center items-center"/>
          </div>
          <div className="absolute inset-0 bg-black/50" />
          {/* Desktop overlay header (hidden on mobile) */}
          <div className="hidden md:flex absolute inset-0 items-end w-full z-10">
            <div className="hotel-container pb-8 px-4 w-full flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="mb-1 md:mb-4 flex justify-between items-center ">
                {/* <Button
                  ref={(el) => { if (el) backBtnRef.current = el; }}
                  onClick={() => router.back()}
                  variant="ghost"
                  aria-label={t("common.back", { defaultValue: `${t("nav.back_button")}` })}
                  className="group h-10 rounded-full bg-white/70 backdrop-blur-sm text-brand-text border border-black/5 px-4 pr-5 shadow-sm hover:bg-brand-primary hover:text-white hover:border-brand-primary/50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
                  <span className="font-medium">
                    {t("common.back", { defaultValue: `${t("nav.back_button")}` })}
                  </span>
                </Button> */}
                <BackButton 
                              onClick={() => router.push('/')} 
                              label="Go Home" // Optional, you can omit this if you just want "Back"
                            />
              </div>
              <div className="section-header section-header-white" ref={(el) => { if (el) headerRef.current = el; }}>
                <h1 className="text-4xl md:text-4xl section-header-text">{title}</h1>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile header below hero (visible on mobile) */}
        <div className='md:hidden'>
          <div className='hotel-container pt-3 pb-2 px-4'>
            <div className='mb-2'>
              {/* <Button
                ref={(el) => { if (el) backBtnRef.current = el; }}
                onClick={() => router.back()}
                variant="ghost"
                aria-label={t("common.back", { defaultValue: `${t("nav.back_button")}` })}
                className="group h-10 rounded-full bg-white/70 backdrop-blur-sm text-brand-text border border-black/5 px-4 pr-5 shadow-sm hover:bg-brand-primary hover:text-white hover:border-brand-primary/50 transition-all"
              >
                <ArrowLeft className='w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5' />
                <span className='font-medium'>
                  {t("common.back", { defaultValue: `${t("nav.back_button")}` })}
                </span>
              </Button> */}
              <BackButton 
                            onClick={() => router.push('/')} 
                            label="Go Home" // Optional, you can omit this if you just want "Back"
                          />
            <div className='w-full' ref={(el) => { if (el) headerRef.current = el; }}>
              <h1 className='w-full text-xl sm:text-2xl font-bold leading-snug whitespace-normal break-words break-all text-left'>
                {title}
              </h1>
            </div>
          </div>
          </div>
        </div>

        <div className='hotel-container mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10'>
          <div className='prose prose-lg max-w-none lg:col-span-2' ref={contentRef}>
            <p className='text-brand-text/80 whitespace-pre-line leading-8'>{content}</p>
          </div>
          <aside className='space-y-4'>
            {images.slice(1).map((src, i) => (
              <img
                key={i}
                src={src}
                className='w-full rounded-xl shadow'
                ref={(el) => { if (el) asideImageRefs.current[i] = el; }}
              />
            ))}
          </aside>
        </div>
      </article>
      <div className='mt-20'>
        <Footer />
      </div>
    </div>
  );
};

export default BlogDetail;
