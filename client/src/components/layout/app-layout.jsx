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
    // Verify session asynchronously in background on mount
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

  // If on login or public page, render standalone view with ambient background
  if (isPublicPage) {
    return (
      <div className="bg-background relative min-h-screen">
        <AmbientBackground />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // Show fullscreen authentication loader ONLY if uninitialized AND not authenticated
  if (!isInitialized && !isAuthenticated) {
    return (
      <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
          {/* Clean Tactile Icon Container */}
          <div className="group relative flex items-center justify-center">
            <div className="border-border bg-card relative flex h-20 w-20 items-center justify-center rounded-2xl border p-2.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/icons/icon-192x192.png"
                alt="MyFinance Logo"
                width={72}
                height={72}
                className="h-full w-full rounded-xl object-cover"
                priority
              />
            </div>
          </div>

          {/* Title & Status Pill */}
          <div className="flex flex-col items-center space-y-2.5">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              MyFinance
            </h2>
            <div className="border-border bg-card flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Verifying secure session...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated on private route, return null while router redirects to /login
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
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
