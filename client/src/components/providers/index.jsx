"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./auth-provider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
