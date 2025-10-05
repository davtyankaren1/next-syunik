import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { usePathname } from 'next/navigation'

const NotFound = () => {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", router.asPath);
  }, [router.asPath]);

  return (
    <main className="relative min-h-screen isolate overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-orange-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[110px]" />

      {/* Content */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="mx-auto w-full max-w-2xl text-center">
          {/* Brand logo */}
          <img
            src="/assets/svgs/white-logo-sign.svg"
            alt="Syunik Boutique Hotel"
            className="mx-auto mb-8 h-16 w-16 opacity-0 animate-[fadeIn_600ms_ease-out_200ms_forwards]"
          />

          {/* Heading */}
          <h1 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-6xl opacity-0 animate-[fadeIn_650ms_ease-out_320ms_forwards]">
            {t('notFound.title')}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-zinc-300 opacity-0 animate-[fadeIn_650ms_ease-out_420ms_forwards]">
            {t('notFound.description')}
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 opacity-0 animate-[fadeIn_650ms_ease-out_520ms_forwards]">
            <Link href="/">
              <Button size="lg" variant="hero" className="min-w-[160px]">
                {t('notFound.goHome')}
              </Button>
            </Link>
            <Link href="/rooms">
              <Button size="lg" variant="outline-hero" className="min-w-[160px]">
                {t('notFound.browseRooms')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Local keyframes for fadeIn to ensure availability */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </main>
  );
};

export default NotFound;
