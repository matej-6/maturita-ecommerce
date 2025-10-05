import { graphql } from "@/graphql";
import { queryOptions } from "@tanstack/react-query";
import { getCurrentSession } from "@/app/data-access-layer/auth/queries";

export const currentSessionQueryDocument = graphql(`
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
  return error.message.toLowerCase().includes("unauthorized");
}

export const currentSessionQueryOptions = queryOptions({
  queryKey: CURRENT_SESSION_QUERY_KEY,
  queryFn: async () => {
    return await getCurrentSession();
  },
  staleTime: 1000 * 60 * 5,
});
