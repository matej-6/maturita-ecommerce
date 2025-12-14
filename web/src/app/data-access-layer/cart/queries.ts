"use server";

import { graphql } from "@/graphql";
import "server-only";
import { ActionResponse } from "../formActionResponse";
import { ExecutionResult } from "graphql";
import { CartQueryQuery } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";

const CartQueryDocument = graphql(`
  query CartQuery {
    cart {
      ...CartFragment
    }
  }
`);

export async function getCartData(): Promise<
  ActionResponse<ExecutionResult<CartQueryQuery>["data"]>
> {
  const res = await execute(CartQueryDocument);

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
