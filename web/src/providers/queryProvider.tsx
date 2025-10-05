"use client";

// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#server-components--nextjs-app-router

import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function getNewQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000 * 10,
        gcTime: 60 * 1000 * 10,
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
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
