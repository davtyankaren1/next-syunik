"use client";

import type { AppProps } from "next/app";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
import GlobalBookButton from "@/app/GlobalBookButton";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
      <GlobalBookButton />
    </Providers>
  );
}
