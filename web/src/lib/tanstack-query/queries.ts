import {
  authRefreshTokenAction,
  getCurrentSessionAction,
} from "@/app/data-access-layer/auth/actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "./query-keys";

export const useSession = () =>
  useSuspenseQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const refreshTokenRes = await authRefreshTokenAction();
      if (!refreshTokenRes.success) {
        return null;
      }
      const session = await getCurrentSessionAction();
      return session === null
        ? null
        : {
            ...session,
            __fromServer: false,
          };
    },
    staleTime(query) {
      return query.state.data === null
        ? Infinity
        : query.state.data?.__fromServer === true
        ? 0
        : 60 * 1000 * 14;
    },
    refetchInterval(query) {
      return query.state.data === null
        ? false
        : query.state.data?.__fromServer === true
        ? 5 * 1000
        : 60 * 1000 * 14;
    },
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
