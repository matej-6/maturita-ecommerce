import { OrderStatus } from "@/graphql/graphql";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  status: OrderStatus;
};

export function OrderStatusLabel({ status }: Props) {
  const t = useTranslations("fields.order.orderStatus");

  let statusText = "";

  switch (status) {
    case OrderStatus.Pending:
      statusText = t("pending");
      break;
    case OrderStatus.Shipped:
      statusText = t("shipped");
      break;
    case OrderStatus.Processing:
      statusText = t("processing");
      break;
    case OrderStatus.Delivered:
      statusText = t("delivered");
      break;
    case OrderStatus.Canceled:
      statusText = t("cancelled");
      break;
    case OrderStatus.Failed:
      statusText = t("failed");
      break;
    default:
      statusText = "Unknown";
  }

  function getStyle(status: OrderStatus) {
    switch (status) {
      case OrderStatus.Pending:
        return "text-yellow-800 bg-yellow-100 stroke-yellow-200";
      case OrderStatus.Processing:
        return "text-blue-800 bg-blue-100 stroke-blue-200";
      case OrderStatus.Shipped:
        return "text-purple-800 bg-purple-100 stroke-purple-200";
      case OrderStatus.Delivered:
        return "text-green-800 bg-green-100 stroke-green-200";
      case OrderStatus.Failed:
        return "text-red-800 bg-red-100 stroke-red-200";
      case OrderStatus.Canceled:
        return "text-gray-800 bg-gray-100 stroke-gray-200";
      default:
        return "text-gray-800 bg-gray-100 stroke-gray-200";
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-1 py-px sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold rounded-md stroke-1",
        getStyle(status),
      )}
    >
      {statusText}
    </div>
  );
}
