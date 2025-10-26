import { authRefreshToken } from "@/app/data-access-layer/auth/actions";
import { useQuery } from "@tanstack/react-query";

export const useAuthTokenQuery = () =>
  useQuery({
    queryKey: ["authToken"],
    queryFn: async () => {
      const res = await authRefreshToken();
      return res.success ? res.authToken : null;
    },
    refetchInterval: (query) => {
      return query.state.data === null ? false : 15 * 60 * 1000;
    },
    staleTime: 15 * 60 * 1000,
  });
