"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

function getNewQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 15 * 60,
        gcTime: 1000 * 15 * 60,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return getNewQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = getNewQueryClient();
    return browserQueryClient;
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  // const persister = createAsyncStoragePersister({
  //   storage: typeof window !== "undefined" ? window.localStorage : undefined,
  // });

  return (
    // <PersistQueryClientProvider
    //   client={queryClient}
    //   persistOptions={{
    //     persister: persister,
    //     maxAge: 1000 * 60 * 5, // 5 minutes
    //   }}
    // >
    //   {children}
    // </PersistQueryClientProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
