"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { checkoutAction } from "@/app/data-access-layer/checkout/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function CheckoutButton({ disabled }: { disabled?: boolean }) {
  const t = useTranslations("cart");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (disabled) {
        return;
      }
      await checkoutAction();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later."
      );
    },
  });

  return (
    <Button
      className="w-full"
      size={"lg"}
      onClick={() => mutate()}
      disabled={isPending || disabled}
    >
      {t("checkoutButton")}
    </Button>
  );
}
