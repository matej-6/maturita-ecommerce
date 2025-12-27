"use server";

import { ExecutionResult } from "graphql";
import { ActionResponse } from "../../formActionResponse";
import { AdminUsersPageQuery, Role, UserSortingField } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { AdminUsersPageDocument } from "./queries";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { AdminUpdateUserRoleMutationDocument } from "./mutations";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

export type PagingArgs = {
  cursor: number | null;
  nextCursor: number | null;
  pageSize: number;
};

export type SortingArgs = {
  ascending: boolean | null;
  sortBy: UserSortingField | null;
};

export type TableArgs = {
  id: number | null;
  role: Role | null;
  email: string | null;
};

export async function getAdminUsersPageData(
  args: TableArgs & PagingArgs & SortingArgs
): Promise<ActionResponse<ExecutionResult<AdminUsersPageQuery>["data"]>> {
  const res = await execute(AdminUsersPageDocument, {
    ascending: args.ascending,
    cursor: args.cursor,
    email: args.email,
    id: args.id,
    pageSize: args.pageSize,
    role: args.role,
    sortBy: args.sortBy,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function updateUserRoleAction(
  id: number,
  newRole: Role
): Promise<ActionResponse<null>> {
  const res = await execute(AdminUpdateUserRoleMutationDocument, {
    id,
    role: newRole,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();

  revalidatePath(`/${locale}/admin/users`);

  return {
    success: true,
    data: null,
  };
}
