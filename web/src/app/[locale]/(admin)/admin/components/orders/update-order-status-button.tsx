"use client";

import { AdminUpdateOrderAction } from "@/app/data-access-layer/admin/order/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OrderStatus } from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  orderId: number;
  status: OrderStatus;
};

export function UpdateOrderStatusButton({ orderId, status }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(status);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await AdminUpdateOrderAction(orderId, {
        status: selectedStatus,
      });
      if (!res.success) {
        throw new Error(res.message || "Failed to update order status");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton>Update Status</ResponsiveButton>
      </SheetTrigger>
      <SheetContent className="p-2 sm:p-4 flex flex-col gap-y-4">
        <SheetHeader className="p-0!">
          <SheetTitle>Update Order Status</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-4"
        >
          <Select
            onValueChange={(v) => {
              setSelectedStatus(v as OrderStatus);
            }}
            value={selectedStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderStatus.Canceled}>Canceled</SelectItem>
              <SelectItem value={OrderStatus.Failed}>Failed</SelectItem>
              <SelectItem value={OrderStatus.Pending}>Pending</SelectItem>
              <SelectItem value={OrderStatus.Processing}>Processing</SelectItem>
              <SelectItem value={OrderStatus.Shipped}>Shipped</SelectItem>
              <SelectItem value={OrderStatus.Delivered}>Delivered</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-y-2">
            <ResponsiveButton type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Status"}
            </ResponsiveButton>
            <SheetClose asChild>
              <ResponsiveButton variant={"secondary"}>Cancel</ResponsiveButton>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
