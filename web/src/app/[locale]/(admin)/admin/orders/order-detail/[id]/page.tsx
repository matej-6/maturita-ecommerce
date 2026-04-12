"use server";

import { getAdminOrderDetailPageDataAction } from "@/app/data-access-layer/admin/order/queries";
import { getImageSrc } from "@/app/lib/utils";
import { OrderStatusLabel } from "@/components/orders/order-status";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { ArrowUpRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { UpdateOrderStatusButton } from "../../../components/orders/update-order-status-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderPage({ params }: Props) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    return notFound();
  }

  const data = await getAdminOrderDetailPageDataAction(parsedId);
  if (!data.success) {
    return (
      <div className="max-width-container mt-6 xl:mt-12">
        <h1 className="text-2xl font-medium">Failed to load order.</h1>
      </div>
    );
  }

  if (!data.data?.findOrderById) {
    return notFound();
  }

  const order = data.data.findOrderById;
  const t = await getTranslations("orderPage");
  const ft = await getTranslations("fields.order");

  return (
    <div className="max-width-container mt-6 xl:mt-12 flex flex-col gap-y-6 sm:gap-y-12">
      <h1 className="text-2xl sm:text-4xl font-semibold">
        {t("order")} #{order.id}
      </h1>
      <div className="flex flex-col gap-y-1 sm:gap-y-3">
        <div>
          <UpdateOrderStatusButton orderId={order.id} status={order.status} />
        </div>
        <Card className="w-full flex flex-col gap-y-4 sm:gap-y-6 p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h2 className="text-xs sm:text-sm">{t("basicInformation")}</h2>
            <div className="w-full flex items-start justify-start flex-wrap gap-4 sm:gap-6">
              {[
                {
                  label: ft("id"),
                  node: (
                    <span className="text-base sm:text-lg">{order.id}</span>
                  ),
                },
                {
                  label: ft("status"),
                  node: (
                    <div className="w-fit">
                      <OrderStatusLabel status={order.status} />
                    </div>
                  ),
                },
                {
                  label: ft("total"),
                  node: (
                    <span className="text-base sm:text-lg">
                      ${(order.totalInCents / 100).toFixed(2)}
                    </span>
                  ),
                },
                {
                  label: ft("createdAt"),
                  node: (
                    <span className="text-base sm:text-lg">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  ),
                },
                {
                  label: ft("updatedAt"),
                  node: (
                    <span className="text-base sm:text-lg">
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </span>
                  ),
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-y-0 w-36 sm:w-64">
                  <span className="font-mono text-xs leading-[120%] text-muted-foreground">
                    {item.label}
                  </span>
                  {item.node}
                </div>
              ))}
            </div>
          </div>
          {order.shippingDetails && (
            <>
              <div className="h-0.5 w-full bg-accent" />
              <div className="flex flex-col gap-2 sm:gap-4">
                <h2 className="text-xs sm:text-sm">{t("shippingDetails")}</h2>
                <div className="w-full flex items-start justify-start flex-wrap gap-4 sm:gap-6">
                  {[
                    {
                      label: ft("shippingDetails.line1"),
                      value: order.shippingDetails.line1 ?? "N/A",
                    },
                    {
                      label: ft("shippingDetails.line2"),
                      value: order.shippingDetails.line2 ?? "N/A",
                    },
                    {
                      label: ft("shippingDetails.state"),
                      value: order.shippingDetails.state ?? "N/A",
                    },
                    {
                      label: ft("shippingDetails.postalCode"),
                      value: order.shippingDetails.postalCode ?? "N/A",
                    },
                    {
                      label: ft("shippingDetails.country"),
                      value: order.shippingDetails.country ?? "N/A",
                    },
                    {
                      label: ft("shippingDetails.city"),
                      value: order.shippingDetails.city ?? "N/A",
                    },
                    {
                      label: ft("shippingDetails.phone"),
                      value: order.shippingDetails.phone ?? "N/A",
                    },
                  ].map(
                    (item, i) =>
                      item.value && (
                        <div
                          key={i}
                          className="flex flex-col gap-y-0 w-36 sm:w-64"
                        >
                          <span className="font-mono text-xs leading-[120%] text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="text-base sm:text-lg">
                            {item.value}
                          </span>
                        </div>
                      ),
                  )}
                </div>
              </div>
            </>
          )}
          <div className="h-0.5 w-full bg-accent" />
          <div className="flex flex-col gap-2 sm:gap-4">
            <h2 className="font-medium text-base">{t("items")}</h2>
            <Table className="w-full">
              <TableHeader className="w-full">
                <TableRow className="w-full *:h-fit p-1 sm:p-2 *:font-mono *:text-muted-foreground *:font-medium *:text-xs *:sm:text-sm grid grid-cols-[48px_196px_1fr_1fr] sm:grid-cols-[64px_256px_1fr_1fr] items-center gap-x-1 sm:gap-x-4">
                  <TableHead>{t("itemsTable.image")}</TableHead>
                  <TableHead>{t("itemsTable.sku")}</TableHead>
                  <TableHead>{t("itemsTable.unitPrice")}</TableHead>
                  <TableHead>{t("itemsTable.quantity")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, i) => {
                  const thumbnailImage =
                    item.productVariant?.thumbnailImage ??
                    item.productVariant?.product.thumbnailImage ??
                    null;

                  return (
                    <TableRow
                      key={i}
                      className="w-full *:h-fit p-1 sm:p-2 *:text-sm *:sm:text-base grid grid-cols-[48px_196px_1fr_1fr] sm:grid-cols-[64px_256px_1fr_1fr] items-center gap-x-1 sm:gap-x-4"
                    >
                      <TableCell>
                        <div className="w-full aspect-square overflow-hidden rounded-sm sm:rounded-md bg-muted flex items-center justify-center object-cover">
                          {thumbnailImage && (
                            <img
                              src={getImageSrc(thumbnailImage.url)}
                              alt={"Image of " + item.productVariant?.sku}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.productVariant != null ? (
                          <Link
                            className="flex items-center justify-start gap-x-1 flex-wrap overflow-x-scroll"
                            href={`/product/${item.productVariant.product.slug}?variant=${item.productVariant.sku}`}
                          >
                            <span className="break-words">{item.sku}</span>
                            <ArrowUpRightIcon className="size-3 sm:size-4" />
                          </Link>
                        ) : (
                          item.sku
                        )}
                      </TableCell>
                      <TableCell>
                        {(item.unitPriceInCents / 100).toFixed(2)} €
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
