"use server";

import { categoryFormSchemaType } from "@/app/[locale]/(admin)/admin/schemas/category-form-schema";
import { execute } from "@/graphql/execute";
import { EditCategoryMutation, NewCategoryMutation } from "./mutations";
import { authLogoutAction } from "../../auth/actions";
import { FormActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import { EditCategoryMutationMutation } from "@/graphql/graphql";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

export async function createCategoryAction(
  data: categoryFormSchemaType
): Promise<FormActionResponse<{ id: string }>> {
  const res = await execute(NewCategoryMutation, {
    parentCategoryId: data.parentCategoryId || undefined,
    slug: data.slug,
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
    data: {
      id: res.data!.createCategory.id,
    },
  };
}

export async function editCategoryAction(
  id: string,
  data: categoryFormSchemaType
): Promise<
  FormActionResponse<
    NonNullable<
      ExecutionResult<EditCategoryMutationMutation>["data"]
    >["updateCategory"]
  >
> {
  const res = await execute(EditCategoryMutation, {
    id: id,
    parentCategoryId: data.parentCategoryId || undefined,
    slug: data.slug,
  });

  console.log(res);

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
    data: res.data.updateCategory,
  };
}
