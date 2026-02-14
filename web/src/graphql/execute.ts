import "server-only";

import type { TypedDocumentString } from "./graphql";
import { getLocale } from "next-intl/server";
import { fetchInternal } from "@/app/data-access-layer/fetch-internal";
import { ExecutionResult } from "graphql";
import { getAuthToken } from "@/app/data-access-layer/auth/actions";
import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const locale = await getLocale();
  const authToken = await getAuthToken();

  const headers: HeadersInit = {
    "x-custom-lang": locale,
  };
  if (authToken) {
    headers["Authorization"] = "Bearer " + authToken;
  }

  const response = await fetchInternal(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/graphql-response+json",
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    },
  );

  if ([401, 403].includes(response.status)) {
    redirect({ href: "/auth/login", locale });
  }

  if (response.status === 404) {
    notFound();
  }

  return response.json() as ExecutionResult<TResult>;
}
