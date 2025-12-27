import { graphql } from "@/graphql";
import "server-only";

export const AdminUpdateOrderMutationDocument = graphql(`
  mutation AdminUpdateOrder($id: Int!, $newStatus: OrderStatus!) {
    updateOrder(orderId: $id, input: { status: $newStatus })
  }
`);
