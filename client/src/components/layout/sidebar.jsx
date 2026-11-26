"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/constants/navigation";
import { useAppStore } from "@/stores/use-app-store";
import { triggerHaptic } from "@/utils/haptics";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  const handleToggleSidebar = () => {
    triggerHaptic("light");
    toggleSidebar();
  };

  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar-bg sticky top-0 z-30 hidden h-screen flex-col border-r transition-all duration-300 md:flex",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Brand Header */}
      <div className="border-border flex h-16 items-center justify-between border-b px-4">
        <Link href="/" onClick={() => triggerHaptic("light")} className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-card/80 p-1 shadow-sm">
            <Image
              src="/icons/icon-192x192.png"
              alt="RideLedger Logo"
              width={36}
              height={36}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-base leading-tight font-bold tracking-tight">RideLedger</span>
              <span className="text-muted-foreground mt-1 text-[10.5px] leading-tight font-medium">
                Smart Vehicle Logbook
              </span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
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
                onClick={() => triggerHaptic("light")}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  !isSidebarOpen && "justify-center px-0",
                  isActive
                    ? "bg-primary/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground font-medium"
                )}
                title={!isSidebarOpen ? item.title : undefined}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="bg-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-200"
                  />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
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
                onClick={() => triggerHaptic("light")}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  !isSidebarOpen && "justify-center px-0",
                  isActive
                    ? "bg-primary/10 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground font-medium"
                )}
                title={!isSidebarOpen ? item.title : undefined}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="bg-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-200"
                  />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
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
