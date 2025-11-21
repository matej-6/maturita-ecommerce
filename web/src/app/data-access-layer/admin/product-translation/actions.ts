"use server";

import { execute } from "@/graphql/execute";
import { ActionResponse } from "../../formActionResponse";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { ExecutionResult } from "graphql";
import { DeleteProductTranslationMutationMutation } from "@/graphql/graphql";
import { DeleteProductTranslationMutation } from "./mutations";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

export async function deleteProductTranslationAction(
  translationId: number,
  product: {
    id: number;
    slug: number;
  }
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<DeleteProductTranslationMutationMutation>["data"]
    >["deleteProductTranslation"]
  >
> {
  const res = await execute(DeleteProductTranslationMutation, {
    id: translationId,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();

  revalidatePath(`/${locale}/admin/products`);
  revalidatePath(`/${locale}/admin/products/product-detail/${product.id}`);
  revalidatePath(`/${locale}/product/${product.slug}`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.deleteProductTranslation,
  };
}
