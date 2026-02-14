"use server";

import { execute } from "@/graphql/execute";
import { ActionResponse } from "../formActionResponse";
import {
  DeleteAccountAvatarMutation,
  DeleteUserAccountMutation,
  UpdateAccountAvatarMutation,
  UpdateUserMutation,
  UpdateUserPasswordMutation,
} from "./mutations";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { authLogoutAction } from "../auth/actions";
import { ExecutionResult } from "graphql";
import {
  UpdateUserMutationMutation,
  UpdateUserPasswordMutationMutation,
} from "@/graphql/graphql";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { E } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";

export async function deleteUserAccountAction(): Promise<ActionResponse<void>> {
  const res = await execute(DeleteUserAccountMutation);

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  try {
    await authLogoutAction();
  } catch (e) {
    console.error("Failed to logout after account deletion:", e);
  }

  return {
    success: true,
    data: undefined,
  };
}

export async function updateUserAvatarAction(
  base64: string,
  mimeType: string,
): Promise<ActionResponse<void>> {
  const res = await execute(UpdateAccountAvatarMutation, {
    base64: base64,
    mimeType: mimeType,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/account-details`);

  return {
    success: true,
    data: undefined,
  };
}

export async function removeUserAvatarAction(): Promise<ActionResponse<void>> {
  const res = await execute(DeleteAccountAvatarMutation);

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/account-details`);

  return {
    success: true,
    data: undefined,
  };
}

export async function updateUserAction(formData: {
  name: string;
  lastName: string;
  email: string;
}): Promise<
  ActionResponse<ExecutionResult<UpdateUserMutationMutation>["data"]>
> {
  const res = await execute(UpdateUserMutation, { ...formData });
  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/account-details`);

  return {
    success: true,
    data: res.data,
  };
}

export async function updateUserPasswordAction(formData: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<
  ActionResponse<ExecutionResult<UpdateUserPasswordMutationMutation>["data"]>
> {
  const res = await execute(UpdateUserPasswordMutation, {
    ...formData,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
