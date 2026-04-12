"use server";
import { execute } from "@/graphql/execute";
import { HomepageQueryQuery } from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { ActionResponse } from "../formActionResponse";
import { HomepageQueryDocument } from "./queries";

export async function getHomepageData(): Promise<
  ActionResponse<ExecutionResult<HomepageQueryQuery>["data"]>
> {
  const res = await execute(HomepageQueryDocument);
  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
