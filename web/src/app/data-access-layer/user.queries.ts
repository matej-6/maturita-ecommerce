"use server";

import "server-only";
import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import {
  AccountDetailsPageQueryQuery,
  ProductPageQueryQuery,
} from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { ActionResponse } from "./formActionResponse";
import { handleGraphqlError } from "./admin/handleGraphqlFormError";

const AccountDetailsPageDocument = graphql(`
  query AccountDetailsPageQuery {
    me {
      firstName
      lastName
      email
      avatar {
        base64
        mimeType
      }
      createdAt
      updatedAt
    }
  }
`);

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
