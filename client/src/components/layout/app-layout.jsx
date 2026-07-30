"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { AmbientBackground } from "./ambient-background";
import { Loader2 } from "lucide-react";

export function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitialized, isLoading, checkAuthSession } = useAuthStore();

  const isLoginPage = pathname === "/login";
  const isPublicPage = isLoginPage;

  useEffect(() => {
    // Check user session on app load
    checkAuthSession();
  }, [checkAuthSession]);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated && !isPublicPage) {
        router.replace("/login");
      } else if (isAuthenticated && isLoginPage) {
        router.replace("/");
      }
    }
  }, [isInitialized, isAuthenticated, isLoginPage, isPublicPage, router]);

  // If on login or public test page, render standalone view with ambient background
  if (isPublicPage) {
    return (
      <div className="bg-background relative min-h-screen">
        <AmbientBackground />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // Show authentication check loader while session is initializing
  if (!isInitialized || (isLoading && !isAuthenticated)) {
    return (
      <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <AmbientBackground />

        {/* Ambient Radial Glow Aura */}
        <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-primary/10 blur-[130px] animate-pulse" />
        <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px]" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
          {/* Glowing Glass Icon Container */}
          <div className="group relative flex items-center justify-center">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-primary/30 via-emerald-500/25 to-amber-500/30 blur-xl opacity-80 animate-pulse" />
            <div className="border-border/80 bg-card/90 relative flex h-24 w-24 items-center justify-center rounded-3xl border p-3 shadow-2xl backdrop-blur-2xl transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/icons/icon-192x192.png"
                alt="MyFinance Logo"
                width={80}
                height={80}
                className="h-full w-full rounded-2xl object-cover shadow-sm"
                priority
              />
            </div>
          </div>

          {/* Title & Animated Status Pill */}
          <div className="flex flex-col items-center space-y-2.5">
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight">
              MyFinance
            </h2>
            <div className="border-border/60 bg-card/75 flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-lg backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Verifying secure session...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated on private route, return empty while router redirects to /login
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated layout with navigation, sidebars, and ambient background glow
  return (
    <div className="bg-background relative flex min-h-screen">
      <AmbientBackground />
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
