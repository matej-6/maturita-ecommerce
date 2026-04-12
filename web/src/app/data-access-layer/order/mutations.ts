"use server";

import { graphql } from "@/graphql";
import "server-only";

export const cancelOrderMutationDocument = graphql(`
  mutation CancelOrderMutation($id: Int!) {
    cancelOrder(id: $id) {
      id
    }
  }
`);

export const retryPendingOrder = graphql(`
  mutation RetryPendingOrder($id: Int!) {
    retryPendingPayment(orderId: $id)
  }
`);
