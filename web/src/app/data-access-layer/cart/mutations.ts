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
import { getAuthToken } from "../auth/actions";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

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
  quantity: number,
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
  quantity: number,
): Promise<
  ActionResponse<ExecutionResult<AddItemToCartMutationMutation>["data"]>
> {
  const authToken = await getAuthToken();
  if (!authToken) {
    const locale = await getLocale();
    redirect({ href: "/auth/login", locale });
  }

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
