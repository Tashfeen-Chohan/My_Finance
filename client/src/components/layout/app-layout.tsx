"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { OfflineIndicator } from "@/components/common/offline-indicator";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
      <MobileNav />
      <OfflineIndicator />
    </div>
  );
}
