"use server";

import { execute } from "@/graphql/execute";
import { ActionResponse } from "../../formActionResponse";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { ExecutionResult } from "graphql";
import {
  CreateProductTranslationMutationMutation,
  DeleteProductTranslationMutationMutation,
  EditProductTranslationMutationMutation,
} from "@/graphql/graphql";
import {
  CreateProductTranslationMutation,
  DeleteProductTranslationMutation,
  EditProductTranslationMutation,
} from "./mutations";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { productTranslationFormSchemaType } from "@/app/[locale]/(admin)/admin/schemas/product-translation-schema";

export async function deleteProductTranslationAction(
  translationId: number,
  product: {
    id: number;
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

export async function createProductTranslationAction(
  productId: number,
  data: {
    name: string;
    locale: string;
    description?: string;
    markdownContent?: string;
  }
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<CreateProductTranslationMutationMutation>["data"]
    >["createProductTranslation"]
  >
> {
  const res = await execute(CreateProductTranslationMutation, {
    productId: productId,
    name: data.name,
    description: data.description || null,
    localeCode: data.locale,
    markdownContent: data.markdownContent || null,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.createProductTranslation,
  };
}

export async function editProductTranslationAction(
  productTranslationId: number,
  productId: number,
  data: {
    name: string;
    locale: string;
    description?: string;
    markdownContent?: string;
  }
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<EditProductTranslationMutationMutation>["data"]
    >["editProductTranslation"]
  >
> {
  const res = await execute(EditProductTranslationMutation, {
    translationId: productTranslationId,
    name: data.name,
    description: data.description || null,
    localeCode: data.locale,
    markdownContent: data.markdownContent || null,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.editProductTranslation,
  };
}
