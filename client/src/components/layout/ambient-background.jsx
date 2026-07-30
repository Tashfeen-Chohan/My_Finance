"use client";

import React from "react";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/12 blur-3xl animate-pulse" />
      <div
        className="absolute top-1/4 -right-40 h-[28rem] w-[28rem] rounded-full bg-cyan-500/12 blur-3xl animate-pulse"
        style={{ animationDuration: "7s" }}
      />
      <div
        className="absolute top-2/3 left-1/3 h-[28rem] w-[28rem] rounded-full bg-purple-500/12 blur-3xl animate-pulse"
        style={{ animationDuration: "9s" }}
      />
      <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
    </div>
  );
}
