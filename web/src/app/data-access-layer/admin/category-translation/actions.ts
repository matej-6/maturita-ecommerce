"use server";

import { execute } from "@/graphql/execute";
import { ActionResponse } from "../../formActionResponse";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { categoryTranslationSchemaType } from "@/app/[locale]/(admin)/admin/schemas/category-translation-schema";
import { ExecutionResult } from "graphql";
import {
  DeleteCategoryTranslationMutationMutation,
  EditCategoryTranslationMutationMutation,
  NewCategoryTranslationMutationMutation,
} from "@/graphql/graphql";
import {
  DeleteCategoryTranslationMutation,
  EditCategoryTranslationMutation,
  NewCategoryTranslationMutation,
} from "./mutations";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function deleteCategoryTranslationAction(
  categoryId: number,
  translationId: number
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<DeleteCategoryTranslationMutationMutation>["data"]
    >["deleteCategoryTranslation"]
  >
> {
  const res = await execute(DeleteCategoryTranslationMutation, {
    id: translationId,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`${locale}/admin/categories/edit-category/${categoryId}`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.deleteCategoryTranslation,
  };
}

export async function createCategoryTranslationAction(
  categoryId: number,
  data: { name: string; description?: string; locale: string }
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<NewCategoryTranslationMutationMutation>["data"]
    >["createCategoryTranslation"]
  >
> {
  const res = await execute(NewCategoryTranslationMutation, {
    categoryId: categoryId,
    name: data.name,
    description: data.description || null,
    localeCode: data.locale,
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
    data: res.data.createCategoryTranslation,
  };
}

export async function editCategoryTranslationAction(
  categoryId: number,
  categoryTranslationId: number,
  data: { name: string; description?: string; locale: string }
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<EditCategoryTranslationMutationMutation>["data"]
    >["updateCategoryTranslation"]
  >
> {
  const res = await execute(EditCategoryTranslationMutation, {
    translationId: categoryTranslationId,
    name: data.name,
    description: data.description || null,
    localeCode: data.locale,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`${locale}/admin/categories/edit-category/${categoryId}`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.updateCategoryTranslation,
  };
}
