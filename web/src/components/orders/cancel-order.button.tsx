"use client";

import { useMutation } from "@tanstack/react-query";
import { cancelOrderMutationAction } from "@/app/data-access-layer/order/actions";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

type props = {
  orderId: number;
};

export function CancelOrderButton({ orderId }: props) {
  const router = useRouter();
  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      const res = await cancelOrderMutationAction(orderId);
      if (!res.success) {
        toast.error(res.message);
      } else {
        router.push(`/account-details`);
      }
    },
  });

  const t = useTranslations("orderPage.buttons");

  return (
    <>
      <Button
        variant={"destructive"}
        disabled={isCancelling}
        onClick={() => cancelOrder()}
      >
        {isCancelling ? t("pendingCancelOrder") : t("cancelOrder")}
      </Button>
    </>
  );
}
