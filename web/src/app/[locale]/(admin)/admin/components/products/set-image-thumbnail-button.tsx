"use client";

import {
  setProductThumbnailImageAction,
  setVariantThumbnailImageAction,
} from "@/app/data-access-layer/admin/product/actions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

type Props = {
  productId: number;
  productVariantId?: number;
  imageId: number;
};

export function SetImageThumbnailButton({
  productId,
  productVariantId,
  imageId,
}: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (productVariantId !== undefined) {
        await setVariantThumbnailImageAction(
          productId,
          productVariantId,
          imageId
        );
      } else {
        await setProductThumbnailImageAction(productId, imageId);
      }
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate()}
      variant={"blackTransparent"}
      size={"xs"}
    >
      {isPending ? "Setting..." : "Set as Thumbnail"}
    </Button>
  );
}
