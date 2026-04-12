"use server";

import { execute } from "@/graphql/execute";
import {
  CancelOrderMutationMutation,
  OrderDetailsPageQueryQuery,
} from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { ActionResponse } from "../formActionResponse";
import { cancelOrderMutationDocument, retryPendingOrder } from "./mutations";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { OrderDetailsPageDocument } from "./queries";

export async function cancelOrderMutationAction(
  id: number,
): Promise<
  ActionResponse<ExecutionResult<CancelOrderMutationMutation>["data"]>
> {
  const res = await execute(cancelOrderMutationDocument, { id });
  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function retryPendingOrderAction(
  id: number,
): Promise<ActionResponse<void>> {
  const res = await execute(retryPendingOrder, { id });
  if (res.errors) {
    const handledError = await handleGraphqlError(res.errors);
    return {
      success: false,
      message: handledError.message,
    };
  }

  if (!res.data?.retryPendingPayment) {
    return {
      success: false,
      message: "Failed to retry payment.",
    };
  }

  const locale = await getLocale();

  revalidatePath(`/${locale}/account/orders/${id}`);
  revalidatePath(`/${locale}/account`);
  redirect(res.data?.retryPendingPayment);
}
export async function getOrderDetailsPageData(
  id: number,
): Promise<
  ActionResponse<ExecutionResult<OrderDetailsPageQueryQuery>["data"]>
> {
  const res = await execute(OrderDetailsPageDocument, { id });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
