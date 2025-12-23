"use client";

import { OrderStatus } from "@/graphql/graphql";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { cancelOrderMutationAction } from "@/app/data-access-layer/order/mutations";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

type props = {
  orderId: number;
};

export function CancelOrderButton({ orderId }: props) {
  const router = useRouter();
  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      const res = await cancelOrderMutationAction(orderId);
      if (!res.success) {
        toast.error(res.message || "Failed to cancel order.");
      } else {
        router.push(`/account/orders`);
      }
    },
  });

  return (
    <>
      <Button
        variant={"destructive"}
        disabled={isCancelling}
        onClick={() => cancelOrder()}
      >
        {isCancelling ? "Cancelling..." : "Cancel Order"}
      </Button>
    </>
  );
}
