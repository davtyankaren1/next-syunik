"use client";

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollToTop() {
  const pathname = usePathname() ?? '';

  // Ensure browser does not restore previous scroll when navigating back
  useEffect(() => {
    const { scrollRestoration } = window.history as any;
    const prev = scrollRestoration;
    try {
      window.history.scrollRestoration = 'manual';
    } catch {}
    return () => {
      try {
        window.history.scrollRestoration = prev || 'auto';
      } catch {}
    };
  }, []);

  // Scroll immediately on route change before paint
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
}
