"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/constants/navigation";
import { triggerHaptic } from "@/utils/haptics";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const activeIndex = MOBILE_NAV_ITEMS.findIndex((item) => item.href === pathname);
  const itemCount = MOBILE_NAV_ITEMS.length || 1;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="border-border/80 bg-bottom-nav-bg/95 fixed right-0 bottom-0 left-0 z-30 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      <div className="relative mx-auto flex h-16 max-w-lg items-center px-2">
        {/* Gliding Soft Pill Indicator */}
        {activeIndex >= 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-2 right-2 left-2 flex items-center"
          >
            <div
              className="flex h-full items-center justify-center px-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `${100 / itemCount}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            >
              <div className="bg-primary/12 border-primary/20 h-full w-full max-w-[64px] rounded-2xl border transition-opacity duration-200" />
            </div>
          </div>
        )}

        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => triggerHaptic("light")}
              className={cn(
                "relative z-10 flex h-12 flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 select-none",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-all duration-300 ease-out",
                  isActive ? "scale-110 stroke-[2.2]" : "scale-100 stroke-[1.75]"
                )}
              />
              <span
                className={cn(
                  "text-[10.5px] leading-none tracking-tight transition-all duration-200",
                  isActive ? "font-semibold" : "font-medium opacity-80"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
