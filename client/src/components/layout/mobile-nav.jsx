"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/constants/navigation";
import { triggerHaptic } from "@/utils/haptics";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border bg-bottom-nav-bg/95 fixed right-0 bottom-0 left-0 z-30 flex min-h-16 items-center justify-around border-t px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => triggerHaptic("light")}
            className={cn(
              "touch-target relative flex w-full flex-col items-center justify-center gap-1 py-1.5 text-xs transition-colors",
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <span className="bg-primary absolute top-0 h-0.5 w-8 rounded-full" />
            )}
            <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-105")} />
            <span className="text-[11px] leading-none">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
