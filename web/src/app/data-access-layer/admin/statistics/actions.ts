"use server";

import { execute } from "@/graphql/execute";
import { AdminPageStatisticsQueryDocument } from "./queries";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import { AdminPageStatisticsQuery } from "@/graphql/graphql";

export async function getAdminStatisticsPageData(): Promise<
  ActionResponse<ExecutionResult<AdminPageStatisticsQuery>["data"]>
> {
  const res = await execute(AdminPageStatisticsQueryDocument);
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
