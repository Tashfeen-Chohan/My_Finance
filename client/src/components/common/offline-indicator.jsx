"use client";

import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isOnline) return null;

  return (
    <div className="fixed right-4 bottom-16 left-4 z-40 md:right-6 md:bottom-6 md:left-auto flex flex-col items-end gap-2">
      <div className="flex items-center gap-2.5 rounded-full bg-amber-500/90 px-4 py-2 text-xs font-semibold text-amber-950 shadow-lg backdrop-blur-md dark:bg-amber-600/90 dark:text-amber-50">
        <WifiOff className="h-4 w-4 animate-pulse" />
        <span>You are offline — Reconnect to manage finance data</span>
      </div>
    </div>
  );
}
