"use server";

import { execute } from "@/graphql/execute";
import { ActionResponse } from "../formActionResponse";
import {
  DeleteAccountAvatarMutation,
  DeleteUserAccountMutation,
  UpdateUserMutation,
  UpdateUserPasswordMutation,
} from "./mutations";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { authLogoutAction, getAuthToken } from "../auth/actions";
import { ExecutionResult } from "graphql";
import {
  AccountDetailsPageQueryQuery,
  UpdateUserMutationMutation,
  UpdateUserPasswordMutationMutation,
} from "@/graphql/graphql";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { fetchInternal } from "../fetch-internal";
import { AccountDetailsPageDocument } from "./queries";

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
  formData: FormData,
): Promise<ActionResponse<void>> {
  const locale = await getLocale();
  const authToken = await getAuthToken();

  const headers: HeadersInit = {
    "x-custom-lang": locale,
  };
  if (authToken) {
    headers["Authorization"] = "Bearer " + authToken;
  }

  const res = await fetchInternal(
    process.env.BACKEND_URL + "/users/upload-avatar",
    {
      method: "POST",
      body: formData,
      headers,
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

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
export async function getAccountDetailsPageData(): Promise<
  ActionResponse<ExecutionResult<AccountDetailsPageQueryQuery>["data"]>
> {
  const res = await execute(AccountDetailsPageDocument);

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
