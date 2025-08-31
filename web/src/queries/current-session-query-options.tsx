import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { queryOptions } from "@tanstack/react-query";
import { refreshToken } from "@/lib/refresh-token";

export const CurrentSessionQuery = graphql(`
  query MeQuery {
    me {
      id
      email
      firstName
      lastName
      emailVerified
      avatar
      createdAt
      updatedAt
      role
    }
  }
`);

export const CURRENT_SESSION_QUERY_KEY = ["current-session"];

export function isAuthError(error: Error) {
  return error.message.includes("Unauthorized");
}

export const currentSessionQueryOptions = queryOptions({
  queryKey: CURRENT_SESSION_QUERY_KEY,
  queryFn: async () => {
    const res = await execute(CurrentSessionQuery);
    if (res.errors) {
      if (res.errors.some((e) => isAuthError(e))) {
        const isRefreshed = await refreshToken();
        if (isRefreshed) {
          const res = await execute(CurrentSessionQuery);
          return res.data?.me ?? null;
        }
      } else {
        throw new Error(res.errors[0].message);
      }
    }
    return res.data?.me ?? null;
  },
  staleTime: 1000 * 60 * 5,
  retry: (failureCount, error: Error) => {
    console.log(failureCount, error);
    if (failureCount > 3 || isAuthError(error)) {
      return false;
    }
    return true;
  },
});
