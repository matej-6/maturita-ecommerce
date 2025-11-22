"use client";

import { setProductThumbnailImageAction } from "@/app/data-access-layer/admin/product/actions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

type Props = {
  productId: number;
  imageId: number;
};

export function SetImageThumbnailButton({ productId, imageId }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await setProductThumbnailImageAction(productId, imageId);
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
