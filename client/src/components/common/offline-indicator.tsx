"use client";

import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useAppStore } from "@/stores/use-app-store";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const isSyncing = useAppStore((state) => state.isSyncing);
  const pendingSyncCount = useAppStore((state) => state.pendingSyncCount);

  if (isOnline && !isSyncing && pendingSyncCount === 0) return null;

  return (
    <div className="fixed right-4 bottom-16 left-4 z-40 md:right-6 md:bottom-6 md:left-auto">
      {!isOnline && (
        <div className="flex items-center gap-2 rounded-full bg-amber-500/90 px-4 py-2 text-xs font-medium text-amber-950 shadow-lg backdrop-blur-md dark:bg-amber-600/90 dark:text-amber-50">
          <WifiOff className="h-4 w-4 animate-pulse" />
          <span>Offline Mode - Changes saved locally</span>
        </div>
      )}
      {isOnline && isSyncing && (
        <div className="bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Syncing local data...</span>
        </div>
      )}
    </div>
  );
}
