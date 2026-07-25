"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border bg-card/95 fixed right-0 bottom-0 left-0 z-30 flex h-16 items-center justify-around border-t px-2 backdrop-blur-md md:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-1 py-1 text-xs transition-colors",
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
            <span className="text-[10px]">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
