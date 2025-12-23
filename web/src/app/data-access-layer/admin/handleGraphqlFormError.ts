"use server";

import { GraphQLError } from "graphql";
import { notFound } from "next/navigation";

export async function handleGraphqlError(
  errors: readonly GraphQLError[],
): Promise<{
  success: false;
  message: string;
  fieldErrors?: { property: string; constraints: string[] }[];
}> {
  const error = errors[0].extensions as GraphQLErrorExtensions;
  if (error.statusCode === 401 || error.statusCode === 403) {
    return notFound();
  }
  for (const error of errors) {
    console.log(error.message);
  }
  return {
    success: false,
    message: errors[0].message,
    fieldErrors: error.errors,
  };
}

export type GraphQLErrorExtensions = {
  statusCode?: number;
  errors?: {
    property: string;
    constraints: string[];
  }[];
};
