"use client";

import { retryPendingOrderAction } from "@/app/data-access-layer/order/actions";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type props = {
  orderId: number;
};

export function RetryOrderButton({ orderId }: props) {
  const { mutate: retryOrder, isPending: isRetrying } = useMutation({
    mutationFn: async () => {
      const res = await retryPendingOrderAction(orderId);
      if (!res.success) {
        toast.error(res.message);
      }
    },
  });

  const t = useTranslations("orderPage.buttons");

  return (
    <Button disabled={isRetrying} onClick={() => retryOrder()}>
      {isRetrying ? t("pendingRetryPayment") : t("retryPayment")}
    </Button>
  );
}
