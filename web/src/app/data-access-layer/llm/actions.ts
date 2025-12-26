"use server";

import { ExecutionResult } from "graphql";
import { ActionResponse } from "../formActionResponse";
import { LlmUserTaskByIdQuery, NewLlmTaskMutation } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { NewLLMTaskMutation } from "./mutations";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { LLMUserTaskByIdQuery } from "./queries";

export async function newLLMTaskAction(
  prompt: string,
  productId?: number
): Promise<ActionResponse<ExecutionResult<NewLlmTaskMutation>["data"]>> {
  const res = await execute(NewLLMTaskMutation, {
    prompt,
    productId: productId || null,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function getLLMTaskByIdAction(
  id: number
): Promise<ActionResponse<ExecutionResult<LlmUserTaskByIdQuery>["data"]>> {
  const res = await execute(LLMUserTaskByIdQuery, {
    id,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
