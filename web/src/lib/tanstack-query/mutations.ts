import { CartFragment } from "@/app/data-access-layer/cart/fragments";
import {
  addItemToCartMutationAction,
  updateCartItemQuantityMutationAction,
} from "@/app/data-access-layer/cart/mutations";
import { getFragmentData } from "@/graphql";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import { getCartData } from "@/app/data-access-layer/cart/queries";

const cartQueryKey = ["cart"];

export const useCartQuery = () =>
  useQuery({
    queryKey: cartQueryKey,
    queryFn: async () => {
      const res = await getCartData();
      if (!res.success || !res.data) {
        return [];
      }

      const data = getFragmentData(CartFragment, res.data.cart);

      return data.items;
    },
  });

export const useUpdateCartItemQuantityMutation = () =>
  useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => {
      const res = await updateCartItemQuantityMutationAction(
        cartItemId,
        quantity
      );

      if (!res.success) {
        return;
      }

      const data = getFragmentData(
        CartFragment,
        res.data?.updateCartItemQuantity
      );

      const queryClient = getQueryClient();

      queryClient.setQueryData(cartQueryKey, data?.items || []);
    },
  });

export const useAddItemToCartMutation = () =>
  useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => {
      const res = await addItemToCartMutationAction(cartItemId, quantity);

      if (!res.success) {
        return;
      }
      const data = getFragmentData(CartFragment, res.data?.addItemToCart);
      const queryClient = getQueryClient();
      queryClient.setQueryData(cartQueryKey, data?.items || []);
    },
  });
