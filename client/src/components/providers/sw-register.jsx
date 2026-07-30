"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const swUrl = "/service-worker.js";
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("[PWA] Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.warn("[PWA] Service Worker registration failed, trying /sw.js fallback:", error);
          navigator.serviceWorker.register("/sw.js").catch((err) => {
            console.error("[PWA] Fallback service worker registration failed:", err);
          });
        });
    }
  }, []);

  return null;
}
