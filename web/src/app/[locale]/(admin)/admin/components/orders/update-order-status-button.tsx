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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OrderStatus } from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
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

  const t = useTranslations("admin.orders.updateOrderStatus");
  const ft = useTranslations("fields.order.orderStatus");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton>{t("button")}</ResponsiveButton>
      </SheetTrigger>
      <SheetContent className="p-2 sm:p-4 flex flex-col gap-y-4">
        <SheetHeader className="p-0!">
          <SheetTitle>{t("title")}</SheetTitle>
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
              <SelectValue placeholder={t("statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderStatus.Canceled}>
                {ft("cancelled")}
              </SelectItem>
              <SelectItem value={OrderStatus.Failed}>{ft("failed")}</SelectItem>
              <SelectItem value={OrderStatus.Pending}>
                {ft("pending")}
              </SelectItem>
              <SelectItem value={OrderStatus.Processing}>
                {ft("processing")}
              </SelectItem>
              <SelectItem value={OrderStatus.Shipped}>
                {ft("shipped")}
              </SelectItem>
              <SelectItem value={OrderStatus.Delivered}>
                {ft("delivered")}
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-y-2">
            <ResponsiveButton type="submit" disabled={isPending}>
              {t("submitButton")}
            </ResponsiveButton>
            <SheetClose asChild>
              <ResponsiveButton variant={"secondary"}>
                {t("closeButton")}
              </ResponsiveButton>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
