"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/constants/navigation";
import { useAppStore } from "@/stores/use-app-store";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "border-border/60 bg-card/70 backdrop-blur-xl sticky top-0 z-30 hidden h-screen flex-col border-r transition-all duration-300 md:flex",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Brand Header */}
      <div className="border-border flex h-16 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-card/80 p-1 shadow-sm">
            <Image
              src="/icons/icon-192x192.png"
              alt="MyFinance Logo"
              width={36}
              height={36}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-base leading-tight font-bold tracking-tight">MyFinance</span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-lg"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {isSidebarOpen && (
            <h4 className="text-muted-foreground px-3 text-[11px] font-semibold tracking-wider uppercase">
              Core Modules
            </h4>
          )}
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={!isSidebarOpen ? item.title : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          {isSidebarOpen && (
            <h4 className="text-muted-foreground px-3 text-[11px] font-semibold tracking-wider uppercase">
              Extensions
            </h4>
          )}
          {SECONDARY_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={!isSidebarOpen ? item.title : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isSidebarOpen && (
                  <div className="flex w-full items-center justify-between">
                    <span>{item.title}</span>
                    {item.isPhase2 && (
                      <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[9px] uppercase">
                        Soon
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
