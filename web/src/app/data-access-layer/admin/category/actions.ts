"use server";

import { execute } from "@/graphql/execute";
import { EditCategoryMutation, NewCategoryMutation } from "./mutations";
import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import {
  CategoriesTable_QueryDocumentDocument,
  CategoriesTable_QueryDocumentQuery,
  EditCategoryMutationMutation,
} from "@/graphql/graphql";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export type CategoreisPagingArgs = {
  cursor: number | null;
  pageSize: number;
};

export type CategoriesSortingArgs = {
  sortBy: string | null;
  ascending: boolean | null;
};

export type CategoriesFilterArgs = {
  id: number | null;
  slug: string | null;
  parentCategoryId: number | null;
  isSetup: boolean | null;
  isPublic: boolean | null;
};

export async function getCategoriesTableDataAction(
  pagingArgs: CategoreisPagingArgs,
  sortingArgs: CategoriesSortingArgs,
  filterArgs: CategoriesFilterArgs
): Promise<
  ActionResponse<NonNullable<
    ExecutionResult<CategoriesTable_QueryDocumentQuery>["data"]
  > | null>
> {
  const res = await execute(CategoriesTable_QueryDocumentDocument, {
    pageSize: pagingArgs.pageSize,
    cursor: pagingArgs.cursor,
    sortBy: sortingArgs.sortBy,
    ascending: sortingArgs.ascending,
    id: filterArgs.id,
    slug: filterArgs.slug,
    parentCategoryId: filterArgs.parentCategoryId,
    isSetup: filterArgs.isSetup,
    isPublic: filterArgs.isPublic,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data || null,
  };
}

export async function createCategoryAction(data: {
  parentCategoryId: number | null;
  slug: string;
}): Promise<ActionResponse<{ id: number }>> {
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

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/categories`);

  return {
    success: true,
    data: {
      id: res.data!.createCategory.id,
    },
  };
}

export async function editCategoryAction(
  id: number,
  data: { parentCategoryId: number | null; slug: string }
): Promise<
  ActionResponse<
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

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/categories`);
  revalidatePath(`/${locale}/admin/categories/edit-category/${id}`);

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
