"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/use-app-store";

export function useOnlineStatus() {
  const isOnline = useAppStore((state) => state.isOnline);
  const setOnlineStatus = useAppStore((state) => state.setOnlineStatus);

  useEffect(() => {
    function handleOnline() {
      setOnlineStatus(true);
    }
    function handleOffline() {
      setOnlineStatus(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnlineStatus]);

  return isOnline;
}
