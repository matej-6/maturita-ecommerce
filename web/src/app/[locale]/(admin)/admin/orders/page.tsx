"use server";

import { getProductsPageData } from "@/app/data-access-layer/admin/product/queries";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ProductsTableWithFilters } from "../components/products/product-table-with-filters";
import { OrderStatus } from "@/graphql/graphql";
import z from "zod";
import {
  getAdminOrdersPageDataAction,
  PagingArgs,
  SortingArgs,
  TableArgs,
} from "@/app/data-access-layer/admin/order/queries";
import { OrdersTableWithFilters } from "../components/orders/orders-table-with-filters";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const sortingArgs: SortingArgs = {
    ascending: null,
    sortBy: null,
  };

  const tableArgs: TableArgs = {
    status: null,
    id: null,
    userId: null,
    minPrice: null,
    maxPrice: null,
    dateFrom: null,
    dateTo: null,
  };

  const pagingArgs: PagingArgs = {
    cursor: null,
    nextCursor: null,
    pageSize: 25,
  };

  function parseStatus(statusStr: string): OrderStatus | null {
    switch (statusStr.toLowerCase()) {
      case "pending":
        return OrderStatus.Pending;
      case "processing":
        return OrderStatus.Processing;
      case "shipped":
        return OrderStatus.Shipped;
      case "delivered":
        return OrderStatus.Delivered;
      case "canceled":
        return OrderStatus.Canceled;
      case "failed":
        return OrderStatus.Failed;
      default:
        return null;
    }
  }

  sortingArgs.ascending =
    sp.ascending === "true" ? true : sp.ascending === "false" ? false : null;

  sortingArgs.sortBy = typeof sp.sortBy === "string" ? sp.sortBy : null;

  pagingArgs.cursor =
    typeof sp.cursor === "string" ? parseInt(sp.cursor, 10) || null : null;
  pagingArgs.pageSize =
    typeof sp.pageSize === "string" ? parseInt(sp.pageSize, 10) || 25 : 25;
  tableArgs.status =
    typeof sp.status === "string" ? parseStatus(sp.status) : null;

  if (typeof sp.id === "string") {
    const parsedId = parseInt(sp.id, 10);
    tableArgs.id = isNaN(parsedId) ? null : parsedId;
  }
  if (typeof sp.userId === "string") {
    const parsedUserId = parseInt(sp.userId, 10);
    tableArgs.userId = isNaN(parsedUserId) ? null : parsedUserId;
  }
  if (typeof sp.minPrice === "string") {
    const parsedMinPrice = parseFloat(sp.minPrice);
    tableArgs.minPrice = isNaN(parsedMinPrice) ? null : parsedMinPrice;
  }
  if (typeof sp.maxPrice === "string") {
    const parsedMaxPrice = parseFloat(sp.maxPrice);
    tableArgs.maxPrice = isNaN(parsedMaxPrice) ? null : parsedMaxPrice;
  }
  if (typeof sp.dateFrom === "string") {
    try {
      const parsedDateFrom = z.date().parse(new Date(sp.dateFrom));
      tableArgs.dateFrom = parsedDateFrom;
    } catch {
      tableArgs.dateFrom = null;
    }
  }

  if (typeof sp.dateTo === "string") {
    try {
      const parsedDateTo = z.date().parse(new Date(sp.dateTo));
      tableArgs.dateTo = parsedDateTo;
    } catch {
      tableArgs.dateTo = null;
    }
  }

  tableArgs.id =
    typeof sp.id === "string"
      ? isNaN(parseInt(sp.id, 10))
        ? null
        : parseInt(sp.id, 10)
      : null;

  const ordersData = await getAdminOrdersPageDataAction(
    pagingArgs,
    sortingArgs,
    tableArgs
  );

  pagingArgs.nextCursor =
    ordersData.success && ordersData.data?.findAllPaginatedOrders.hasNextPage
      ? ordersData.data.findAllPaginatedOrders.edges?.slice(-1)[0].cursor ??
        null
      : null;

  const urlSearchParams = new URLSearchParams({
    ...(pagingArgs.cursor ? { cursor: pagingArgs.cursor.toString() } : {}),
    ...(pagingArgs.pageSize
      ? { pageSize: pagingArgs.pageSize.toString() }
      : {}),
    ...(sortingArgs.sortBy ? { sortBy: sortingArgs.sortBy } : {}),
    ...(sortingArgs.ascending !== null
      ? { ascending: sortingArgs.ascending.toString() }
      : {}),
    ...(tableArgs.id ? { id: tableArgs.id.toString() } : {}),
    ...(tableArgs.userId ? { userId: tableArgs.userId.toString() } : {}),
    ...(tableArgs.status ? { status: tableArgs.status.toString() } : {}),
    ...(tableArgs.minPrice ? { minPrice: tableArgs.minPrice.toString() } : {}),
    ...(tableArgs.maxPrice ? { maxPrice: tableArgs.maxPrice.toString() } : {}),
    ...(tableArgs.dateFrom
      ? { dateFrom: tableArgs.dateFrom.toUTCString() }
      : {}),
    ...(tableArgs.dateTo ? { dateTo: tableArgs.dateTo.toUTCString() } : {}),
  });

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="bg-muted/25 dark:bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col">
        <OrdersTableWithFilters
          initialPagingArgs={pagingArgs}
          initialSortingArgs={sortingArgs}
          initialTableArgs={tableArgs}
          searchParams={urlSearchParams.toString()}
          sortableColumns={[
            "id",
            "status",
            "totalInCents",
            "userId",
            "createdAt",
            "updatedAt",
          ]}
          data={
            ordersData.success
              ? ordersData.data?.findAllPaginatedOrders.edges?.map((p) => ({
                  id: p.node.id,
                  status: p.node.status,
                  totalInCents: p.node.totalInCents,
                  createdAt: new Date(p.node.createdAt),
                  updatedAt: new Date(p.node.updatedAt),
                  userId: p.node.userId,
                })) || null
              : null
          }
        />
      </div>
    </div>
  );
}
