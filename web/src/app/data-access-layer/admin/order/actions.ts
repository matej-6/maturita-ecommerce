"use server";

import { AdminUpdateOrderDocument, OrderStatus } from "@/graphql/graphql";
import { ActionResponse } from "../../formActionResponse";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function AdminUpdateOrderAction(
  id: number,
  input: {
    status: OrderStatus;
  }
): Promise<ActionResponse<null>> {
  const res = await execute(AdminUpdateOrderDocument, {
    id: id,
    newStatus: input.status,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();

  revalidatePath(`/${locale}/admin/orders/order-detail/${id}`);
  revalidatePath(`/${locale}/admin/orders`);

  return {
    success: true,
    data: null,
  };
}
