"use server";

import { GraphQLError } from "graphql";
import { notFound } from "next/navigation";

export async function handleGraphqlError(
  errors: readonly GraphQLError[]
): Promise<{
  success: false;
  message: string;
  fieldErrors?: { property: string; constraints: string[] }[];
}> {
  const error = errors[0].extensions as GraphQLErrorExtensions;
  if (error.statusCode === 401 || error.statusCode === 403) {
    return notFound();
  }

  const fieldErrors = Object.entries(error.fieldErrors || {}).map(
    ([property, constraints]) => ({
      property,
      constraints,
    })
  );

  return {
    success: false,
    message: errors[0].message,
    fieldErrors: fieldErrors,
  };
}

export type GraphQLErrorExtensions = {
  statusCode?: number;
  fieldErrors?: Record<string, string[]>;
};
