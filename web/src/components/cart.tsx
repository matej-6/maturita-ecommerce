"use client";

import { useMutation } from "@tanstack/react-query";
import { getImageSrc } from "@/app/lib/utils";
import { Button } from "./ui/button";
import { AlertTriangleIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import {
  useCartQuery,
  useUpdateCartItemQuantityMutation,
} from "@/lib/tanstack-query/mutations";
import { Link } from "@/i18n/navigation";
import { CheckoutButton } from "./checkout-button";

export function Cart() {
  const { data: cartItems, isLoading } = useCartQuery();

  const { mutate: updateCartItemQuantity, isPending: isUpdating } =
    useUpdateCartItemQuantityMutation();

  const { mutate: removeFromCart, isPending: isRemoving } = useMutation({
    mutationFn: async (cartItemId: number) => {
      return updateCartItemQuantity({ cartItemId, quantity: 0 });
    },
  });

  return (
    <div className="flex flex-col gap-y-8 overflow-y-scroll">
      <div className="flex flex-col gap-y-4">
        {isLoading && cartItems === undefined ? (
          [...Array(3)].map((_, idx) => <CartItemSkeleton key={idx} />)
        ) : !cartItems || cartItems.length === 0 ? (
          <span className="text-center">Your cart is empty.</span>
        ) : (
          cartItems.map((item) => {
            const thumbnailImage =
              item.productVariant.thumbnailImage ||
              item.productVariant.product.thumbnailImage ||
              null;

            const variantName = `${item.productVariant.product
              .name!} ${item.productVariant.attributes
              .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
              .map((attr) => attr.value)
              .join(", ")}`;

            return (
              <div
                key={item.id}
                className="flex gap-x-4 p-2 items-start justify-start"
              >
                <div className="w-[196px] overflow-hidden bg-accent flex items-center justify-center">
                  {thumbnailImage && (
                    <img
                      src={getImageSrc(
                        thumbnailImage.mimeType,
                        thumbnailImage.base64
                      )}
                      alt={`Image of ${item.productVariant.sku}`}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="flex flex-col gap-y-0.5">
                    <h3 className="font-medium">{variantName}</h3>
                    <h4 className="text-sm">{item.productVariant.sku}</h4>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span>Quantity:</span>
                    <span>{item.quantity}</span>
                    <div className="flex items-center gap-x-1">
                      <Button
                        size={"xs"}
                        variant={"ghost"}
                        onClick={() =>
                          updateCartItemQuantity({
                            cartItemId: item.id,
                            quantity: item.quantity - 1,
                          })
                        }
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        <MinusIcon />
                      </Button>
                      <Button
                        variant={"ghost"}
                        size={"xs"}
                        onClick={() => {
                          if (item.quantity >= item.productVariant.stock) {
                            return;
                          }
                          updateCartItemQuantity({
                            cartItemId: item.id,
                            quantity: item.quantity + 1,
                          });
                        }}
                        disabled={
                          isUpdating ||
                          item.quantity >= item.productVariant.stock
                        }
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  </div>
                  <h5 className="font-semibold">
                    {(item.productVariant.priceInCents / 100).toFixed(2)} € each
                  </h5>
                  {item.productVariant.stock < item.quantity && (
                    <div className="flex items-start gap-x-1">
                      <AlertTriangleIcon className="text-red-500 size-6" />
                      <span className="text-sm text-red-500">
                        Not enough stock, please reduce quantity.
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant={"destructive"}
                  size={"xs"}
                  onClick={() => removeFromCart(item.id)}
                  disabled={isRemoving}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            );
          })
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-0">
          <h3 className="text-lg font-medium">Total</h3>
          <span className="text-2xl font-bold">
            {cartItems
              ? (
                  cartItems.reduce((acc, item) => {
                    const itemTotal =
                      (item.productVariant.priceInCents / 100) * item.quantity;
                    return acc + itemTotal;
                  }, 0) || 0
                ).toFixed(2)
              : "0.00"}{" "}
            €
          </span>
        </div>
        {/* https://docs.stripe.com/checkout/quickstart?client=react&lang=node */}
        {/* https://docs.stripe.com/checkout/quickstart */}
        {/* https://docs.stripe.com/checkout/fulfillment */}
        <CheckoutButton />
      </div>
    </div>
  );
}

function CartItemSkeleton() {
  return <div className="h-24 bg-muted animate-pulse rounded" />;
}
