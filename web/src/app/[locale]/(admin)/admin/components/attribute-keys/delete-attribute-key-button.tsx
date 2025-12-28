"use client";

import { deleteAttributeKeyAction } from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteAttributeKeyButton({ id }: { id: number }) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await deleteAttributeKeyAction(id);
      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <ResponsiveButton
      variant={"destructive"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete Attribute Key"}
    </ResponsiveButton>
  );
}
