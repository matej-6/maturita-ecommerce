"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { deleteProductReview } from "@/app/data-access-layer/product/actions";

export default function DeleteProductReviewButton({
  orderId,
  reviewId,
}: {
  reviewId: number;
  orderId: number;
}) {
  const t = useTranslations("reviewFormDialog");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await deleteProductReview(reviewId, orderId);
      if (!res.success) {
        throw new Error(res.message || "Failed to delete review.");
      }
    },
  });

  return (
    <Button
      className="w-full"
      variant={"ghost"}
      size={"sm"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {t("deleteReviewButton")}
    </Button>
  );
}
