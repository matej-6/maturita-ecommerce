"use client";

import { deleteAttributeKeyTranslationAction } from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

export function DeleteAttributeKeyTranslationButton({
  id,
  keyId,
}: {
  id: number;
  keyId: number;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await deleteAttributeKeyTranslationAction(id, keyId);
      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Button
      size={"sm"}
      variant={"ghost"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      <XIcon className="size-4" />
    </Button>
  );
}
