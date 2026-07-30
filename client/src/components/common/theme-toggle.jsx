"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = (resolvedTheme || theme) === "dark";

  const handleToggle = (e) => {
    const nextTheme = isDark ? "light" : "dark";

    // View Transition API full-screen radial expansion effect
    if (typeof document !== "undefined" && "startViewTransition" in document && e?.clientX) {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath
          },
          {
            duration: 450,
            easing: "ease-in-out",
            pseudoElement: isDark
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)"
          }
        );
      });
    } else {
      setTheme(nextTheme);
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-50">
        <Sun className="h-4.5 w-4.5 text-amber-500" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="group relative h-9.5 w-9.5 rounded-xl border border-border/40 bg-card/60 p-0 shadow-sm transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:bg-accent/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        {/* Sun Icon for Light Mode with Elastic Rotation & Warm Glow */}
        <Sun
          className={`h-4.5 w-4.5 text-amber-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark
              ? "-rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 group-hover:rotate-45"
          }`}
        />

        {/* Moon Icon for Dark Mode with Elastic Rotation & Sky Blue Glow */}
        <Moon
          className={`absolute h-4.5 w-4.5 text-sky-400 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark
              ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />

        {/* Radial Hover Aura */}
        <span
          className={`pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0 ${
            isDark ? "bg-sky-500/10" : "bg-amber-500/10"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
