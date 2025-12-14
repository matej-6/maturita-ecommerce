"use server";

import "server-only";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import {
  AddItemToCartMutationMutation,
  UpdateCartItemQuantityMutationMutation,
} from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { ActionResponse } from "../formActionResponse";

const UpdateCartItemQuantityMutationDocument = graphql(`
  mutation UpdateCartItemQuantityMutation($cartItemId: Int!, $quantity: Int!) {
    updateCartItemQuantity(cartItemId: $cartItemId, quantity: $quantity) {
      ...CartFragment
    }
  }
`);

const AddItemToCartMutationDocument = graphql(`
  mutation AddItemToCartMutation($productVariantId: Int!, $quantity: Int!) {
    addItemToCart(productVariantId: $productVariantId, quantity: $quantity) {
      ...CartFragment
    }
  }
`);

export async function updateCartItemQuantityMutationAction(
  cartItemId: number,
  quantity: number
): Promise<
  ActionResponse<
    ExecutionResult<UpdateCartItemQuantityMutationMutation>["data"]
  >
> {
  const res = await execute(UpdateCartItemQuantityMutationDocument, {
    cartItemId,
    quantity,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function addItemToCartMutationAction(
  productVariantId: number,
  quantity: number
): Promise<
  ActionResponse<ExecutionResult<AddItemToCartMutationMutation>["data"]>
> {
  const res = await execute(AddItemToCartMutationDocument, {
    productVariantId,
    quantity,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
