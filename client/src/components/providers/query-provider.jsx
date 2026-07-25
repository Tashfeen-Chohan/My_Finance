"use client";

import React, { useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createIDBPersister } from "@/lib/offline/query-persister";

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
          },
        },
      })
  );

  const [persister, setPersister] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPersister(createIDBPersister());
  }, []);

  // Before hydration on client or during SSR, render QueryClientProvider fallback
  if (!persister) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: {
            persistClient: async () => {},
            restoreClient: async () => undefined,
            removeClient: async () => {},
          },
        }}
      >
        {children}
      </PersistQueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 24 * 60 * 60 * 1000 }}
    >
      {children}
      {isMounted && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}
