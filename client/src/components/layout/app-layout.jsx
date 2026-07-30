"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { AmbientBackground } from "./ambient-background";
import { Wallet, Loader2 } from "lucide-react";

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
      <div className="bg-background relative flex min-h-screen flex-col items-center justify-center space-y-4">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="bg-primary/10 text-primary flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl border border-primary/20 shadow-xl shadow-primary/10">
            <Wallet className="h-7 w-7" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Verifying secure session...</span>
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
