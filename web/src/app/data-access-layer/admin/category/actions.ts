"use server";

import { newCategoryFormShemaType } from "@/app/[locale]/(admin)/admin/categories/new-category/new-category-form-schema";
import { getAuthKey } from "../../auth/utils";
import { execute } from "@/graphql/execute";
import { NewCategoryMutation } from "./mutations";
import { authLogoutAction } from "../../auth/actions";
import { FormActionResponse } from "../../formActionResponse";

export async function createCategoryAction(
  data: newCategoryFormShemaType
): Promise<FormActionResponse<{ id: string }>> {
  const authKey = await getAuthKey();
  if (!authKey) {
    await authLogoutAction();
  }

  const res = await execute(NewCategoryMutation, {
    parentCategoryId: data.parentCategoryId || null,
    slug: data.slug,
  });

  if (res.errors) {
    const error = res.errors[0].extensions as {
      statusCode?: number;
      errors?: {
        property: string;
        constraints: string[];
      }[];
    };
    return {
      success: false,
      message: res.errors[0].message,
      fieldErrors: error.errors,
    };
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
