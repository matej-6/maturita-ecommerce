"use client";

import {
  deleteProductImageAction,
  deleteVariantImageAction,
} from "@/app/data-access-layer/admin/product/actions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";

type Props = {
  productId: number;
  productVariantId?: number;
  imageId: number;
};
export function DeleteImage({ productId, productVariantId, imageId }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (productVariantId !== undefined) {
        await deleteVariantImageAction(productId, productVariantId, imageId);
      } else {
        await deleteProductImageAction(productId, imageId);
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
      <XIcon className="size-3" />
    </Button>
  );
}
