"use client";

import { AMBIENT_GLOW_COLORS } from "@/constants/theme-colors";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Top-Left: Indigo */}
      <div className={`absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full ${AMBIENT_GLOW_COLORS.indigo} blur-3xl animate-pulse`} />
      
      {/* Top-Right: Cyan */}
      <div
        className={`absolute top-1/4 -right-40 h-[28rem] w-[28rem] rounded-full ${AMBIENT_GLOW_COLORS.cyan} blur-3xl animate-pulse`}
        style={{ animationDuration: "7s" }}
      />
      
      {/* Bottom-Left: Purple (Moved from center-left) */}
      <div
        className={`absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full ${AMBIENT_GLOW_COLORS.purple} blur-3xl animate-pulse`}
        style={{ animationDuration: "9s" }}
      />
      
      {/* Bottom-Right: Emerald */}
      <div className={`absolute -bottom-40 -right-20 h-96 w-96 rounded-full ${AMBIENT_GLOW_COLORS.emerald} blur-3xl`} />
    </div>
  );
}
