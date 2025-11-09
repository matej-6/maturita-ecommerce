"use server";

import { categoryFormSchemaType } from "@/app/[locale]/(admin)/admin/schemas/category-form-schema";
import { execute } from "@/graphql/execute";
import { FormActionResponse } from "../../formActionResponse";
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

export async function deleteCategoryTranslationAction(
  translationId: string
): Promise<
  FormActionResponse<
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
  categoryId: string,
  data: categoryTranslationSchemaType
): Promise<
  FormActionResponse<
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
  categoryTranslationId: string,
  data: categoryTranslationSchemaType
): Promise<
  FormActionResponse<
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
