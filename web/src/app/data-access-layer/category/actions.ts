"use server";
import { execute } from "@/graphql/execute";
import { CategoryQueryQuery } from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { ActionResponse } from "../formActionResponse";
import { CategoryQueryDocument } from "./queries";

export async function getCategoryQueryData(
  slug: string,
  productsCursor: number | null,
  productsPageSize: number | null,
  attributes?: string[][],
): Promise<ActionResponse<ExecutionResult<CategoryQueryQuery>["data"]>> {
  const res = await execute(CategoryQueryDocument, {
    slug,
    productsCursor,
    productsPageSize,
    attributeFilters: attributes,
  });

  if (res.errors) {
    return {
      success: false,
      message: res.errors.map((e) => e.message).join(", "),
    };
  }

  return {
    success: true,
    data: res.data,
  };
}
