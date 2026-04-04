"use client";

import { ReactNode } from "react";
import { Button } from "./ui/button";
import { useAddItemToCartMutation } from "@/lib/tanstack-query/mutations";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  children,
  productVariantId,
  quantity = 1,
  buttonProps,
  className,
}: {
  children: ReactNode;
  productVariantId: number;
  quantity?: number;
  buttonProps?: VariantProps<typeof Button>;
  className?: string;
}) {
  const { mutate: addToCart, isPending: isAdding } = useAddItemToCartMutation();

  return (
    <Button
      disabled={isAdding}
      onClick={() => {
        addToCart({ cartItemId: productVariantId, quantity });
      }}
      {...buttonProps}
      className={cn("font-medium", className)}
    >
      {children}
    </Button>
  );
}
