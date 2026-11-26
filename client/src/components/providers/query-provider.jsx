"use client";

import React, { useState, useEffect, useMemo } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const QUERY_CACHE_STORAGE_KEY = "rideledger_react_query_cache";

export function clearPersistedQueryCache() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(QUERY_CACHE_STORAGE_KEY);
  } catch {
    // Ignore storage access errors
  }
}

function createLocalStoragePersister() {
  return {
    persistClient: (client) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(QUERY_CACHE_STORAGE_KEY, JSON.stringify(client));
      } catch {
        // Ignore storage quota errors
      }
    },
    restoreClient: () => {
      if (typeof window === "undefined") return undefined;
      try {
        const cached = window.localStorage.getItem(QUERY_CACHE_STORAGE_KEY);
        return cached ? JSON.parse(cached) : undefined;
      } catch {
        return undefined;
      }
    },
    removeClient: clearPersistedQueryCache,
  };
}

export function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 24 * 60 * 60 * 1000, // 24 hours
            retry: 1,
            refetchOnWindowFocus: false,
            networkMode: "offlineFirst",
          },
        },
      })
  );

  const persister = useMemo(() => createLocalStoragePersister(), []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        buster: "rideledger-v1",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      {children}
      {isMounted && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}
