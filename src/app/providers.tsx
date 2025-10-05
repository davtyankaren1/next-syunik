"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import CustomCursor from "@/components/CustomCursor";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "@/i18n/config";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <CustomCursor />
            {children}
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </Provider>
  );
}
