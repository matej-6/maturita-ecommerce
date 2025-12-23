import { cn } from "@/lib/utils";

type Props = {
  status: OrderStatusType;
};

export type OrderStatusType =
  | "pending"
  | "shipped"
  | "processing"
  | "delivered"
  | "canceled"
  | "failed";

export function OrderStatus({ status }: Props) {
  let statusText = "";

  switch (status) {
    case "pending":
      statusText = "Pending";
      break;
    case "shipped":
      statusText = "Shipped";
      break;
    case "processing":
      statusText = "Processing";
      break;
    case "delivered":
      statusText = "Delivered";
      break;
    case "canceled":
      statusText = "Canceled";
      break;
    case "failed":
      statusText = "Failed";
      break;
    default:
      statusText = "Unknown";
  }

  function getStyle(status: string) {
    switch (status) {
      case "pending":
        return "text-yellow-800 bg-yellow-100 stroke-yellow-200";
      case "processing":
        return "text-blue-800 bg-blue-100 stroke-blue-200";
      case "shipped":
        return "text-purple-800 bg-purple-100 stroke-purple-200";
      case "delivered":
        return "text-green-800 bg-green-100 stroke-green-200";
      case "failed":
        return "text-red-800 bg-red-100 stroke-red-200";
      case "canceled":
        return "text-gray-800 bg-gray-100 stroke-gray-200";
      default:
        return "text-gray-800 bg-gray-100 stroke-gray-200";
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-1 py-px sm:px-2 sm:py-1 text-[6px] sm:text-xs font-bold rounded-md stroke-1",
        getStyle(status)
      )}
    >
      {statusText}
    </div>
  );
}
