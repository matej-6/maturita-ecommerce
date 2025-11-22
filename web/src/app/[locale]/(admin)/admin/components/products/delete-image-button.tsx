"use client";

import { deleteProductImageAction } from "@/app/data-access-layer/admin/product/actions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";

type Props = {
  productId: number;
  imageId: number;
};

export function DeleteImage({ productId, imageId }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteProductImageAction(productId, imageId);
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate()}
      variant={"blackTransparent"}
      size={"xs"}
    >
      <XIcon className="size-4" />
    </Button>
  );
}
