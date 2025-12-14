"use client";

import { ReactNode } from "react";
import { Button } from "./ui/button";
import { useAddItemToCartMutation } from "@/lib/tanstack-query/mutations";
import { useSession } from "@/lib/tanstack-query/queries";
import { useRouter } from "@/i18n/navigation";

export function AddToCartButton({
  children,
  productVariantId,
  quantity = 1,
}: {
  children: ReactNode;
  productVariantId: number;
  quantity?: number;
}) {
  const { data: currentSession } = useSession();
  const { mutate: addToCart, isPending: isAdding } = useAddItemToCartMutation();

  const router = useRouter();

  return (
    <Button
      disabled={isAdding}
      onClick={() => {
        if (!currentSession) {
          router.push("/auth/login");
        }
        addToCart({ cartItemId: productVariantId, quantity });
      }}
    >
      {children}
    </Button>
  );
}
