"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useAppStore } from "@/stores/use-app-store";
import { syncEngine } from "@/lib/offline/sync-engine";
import { Button } from "@/components/ui/button";

export function SyncStatusIndicator() {
  const isOnline = useOnlineStatus();
  const isSyncing = useAppStore((state) => state.isSyncing);
  const pendingSyncCount = useAppStore((state) => state.pendingSyncCount);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const cleanup = syncEngine.initializeListeners();
    return cleanup;
  }, []);

  const handleManualSync = async () => {
    await syncEngine.processQueue();
  };

  if (!isMounted) return null;
  if (isOnline && !isSyncing && pendingSyncCount === 0) return null;

  return (
    <div className="fixed right-4 bottom-16 left-4 z-40 md:right-6 md:bottom-6 md:left-auto flex flex-col items-end gap-2">
      {/* Offline Mode Alert */}
      {!isOnline && (
        <div className="flex items-center gap-2.5 rounded-full bg-amber-500/90 px-4 py-2 text-xs font-semibold text-amber-950 shadow-lg backdrop-blur-md dark:bg-amber-600/90 dark:text-amber-50">
          <WifiOff className="h-4 w-4 animate-pulse" />
          <span>Offline Mode — {pendingSyncCount} change(s) saved locally</span>
        </div>
      )}

      {/* Syncing in Progress */}
      {isOnline && isSyncing && (
        <div className="flex items-center gap-2.5 rounded-full bg-primary/90 px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg backdrop-blur-md">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Syncing {pendingSyncCount} offline change(s)...</span>
        </div>
      )}

      {/* Pending Sync Queue Online */}
      {isOnline && !isSyncing && pendingSyncCount > 0 && (
        <div className="flex items-center gap-3 rounded-full bg-blue-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-200" />
            <span>{pendingSyncCount} item(s) awaiting sync</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleManualSync}
            className="h-6 rounded-full px-2.5 text-[11px] font-bold"
          >
            Sync Now
          </Button>
        </div>
      )}
    </div>
  );
}
