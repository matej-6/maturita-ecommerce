"use server";

import { productFormSchemaType } from "@/app/[locale]/(admin)/admin/schemas/product-form-schema";
import { ActionResponse } from "../../formActionResponse";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { NewProductPageQueryDocument } from "./queries";
import { ExecutionResult } from "graphql";
import {
  CreateProductMutationMutation,
  NewProductPage_QueryDocumentQuery,
} from "@/graphql/graphql";
import { CreateProductMutation } from "./mutations";

export async function createProductAction(
  data: productFormSchemaType
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<CreateProductMutationMutation>["data"]
    >["createProduct"]
  >
> {
  const res = await execute(CreateProductMutation, {
    categoryId: data.categoryId || undefined,
    slug: data.slug,
    isPublic: data.isPublic,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.createProduct,
  };
}

export async function getDataForNewProductPage(): Promise<
  ActionResponse<
    NonNullable<ExecutionResult<NewProductPage_QueryDocumentQuery>["data"]>
  >
> {
  const res = await execute(NewProductPageQueryDocument);
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data,
  };
}
