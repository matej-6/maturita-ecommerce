"use client";

import { getCurrentSessionAction } from "@/app/data-access-layer/auth/actions";
import { getQueryClient } from "@/lib/get-query-client";
// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#server-components--nextjs-app-router

import { QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export const useSession = () =>
  useSuspenseQuery({
    queryKey: ["session"],
    queryFn: async () => await getCurrentSessionAction(),
    staleTime(query) {
      return query.state.data === null ? Infinity : 60 * 1000;
    },
    refetchInterval: 60 * 1000 * 15,
  });
