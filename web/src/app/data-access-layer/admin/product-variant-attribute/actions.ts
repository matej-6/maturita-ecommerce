"use server";

import { productVariantAttributeKeyFormSchemaType } from "@/app/[locale]/(admin)/admin/schemas/attribute-key-form-schema";
import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import {
  CreateAttributeKeyMutationMutation,
  EditAttributeKeyMutationMutation,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import {
  CreateAttributeKeyMutation,
  CreateAttributeMutation,
  EditAttributeKeyMutation,
} from "./mutations";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { productVariantAttributeFormSchemaType } from "@/app/[locale]/(admin)/admin/schemas/product-variant-attribute-schema";

export async function createAttributeKeyAction(
  data: productVariantAttributeKeyFormSchemaType,
  productId?: number
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<CreateAttributeKeyMutationMutation>["data"]
    >["createProductVariantAttributeKey"]
  >
> {
  const res = await execute(CreateAttributeKeyMutation, {
    key: data.key,
  });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  if (productId) {
    revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  }

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.createProductVariantAttributeKey,
  };
}

export async function editAttributeKeyAction(
  keyId: number,
  data: productVariantAttributeKeyFormSchemaType,
  productId?: number
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<EditAttributeKeyMutationMutation>["data"]
    >["updateProductVariantAttributeKey"]
  >
> {
  const res = await execute(EditAttributeKeyMutation, {
    id: keyId,
    key: data.key,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  if (productId) {
    revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  }

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.updateProductVariantAttributeKey,
  };
}

export async function createAttributeAction(
  data: productVariantAttributeFormSchemaType,
  productId?: number
): Promise<ActionResponse<null>> {
  const res = await execute(CreateAttributeMutation, {
    attributeKeyId: data.attributeKeyId,
    attributeValue: data.attributeValue,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  if (productId) {
    revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  }
  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }
  return {
    success: true,
    data: null,
  };
}
