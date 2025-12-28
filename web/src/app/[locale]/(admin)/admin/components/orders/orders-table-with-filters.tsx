"use client";

import {
  PagingArgs,
  SortingArgs,
  TableArgs,
} from "@/app/data-access-layer/admin/order/queries";
import { OrderStatusLabel } from "@/components/order-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { OrderStatus } from "@/graphql/graphql";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";

type Props = {
  initialPagingArgs: PagingArgs & {
    nextCursor: number | null;
  };
  initialSortingArgs: SortingArgs;
  initialTableArgs: TableArgs;
  searchParams: string;
  data:
    | {
        id: number;
        userId?: number;
        status: OrderStatus;
        totalInCents: number;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null;
  sortableColumns: string[];
};

export function OrdersTableWithFilters({
  initialPagingArgs,
  initialSortingArgs,
  initialTableArgs,
  searchParams,
  sortableColumns,
  data,
}: Props) {
  const [tableArgs, setTableArgs] = useState(initialTableArgs);
  const [isTableArgsChanged, setIsTableArgsChanged] = useState(false);

  useEffect(() => {
    setTableArgs(initialTableArgs);
  }, [initialTableArgs]);

  useEffect(() => {
    setIsTableArgsChanged(
      initialTableArgs.id !== tableArgs.id ||
        initialTableArgs.userId !== tableArgs.userId ||
        initialTableArgs.status !== tableArgs.status ||
        initialTableArgs.minPrice !== tableArgs.minPrice ||
        initialTableArgs.maxPrice !== tableArgs.maxPrice ||
        initialTableArgs.dateFrom !== tableArgs.dateFrom ||
        initialTableArgs.dateTo !== tableArgs.dateTo
    );
  }, [tableArgs, initialTableArgs]);

  const router = useRouter();

  function applyFilters() {
    const id = tableArgs.id && isNaN(tableArgs.id) ? null : tableArgs.id;
    const userId =
      tableArgs.userId && isNaN(tableArgs.userId) ? null : tableArgs.userId;
    const status = tableArgs.status;
    const minPrice =
      tableArgs.minPrice && isNaN(tableArgs.minPrice)
        ? null
        : tableArgs.minPrice;
    const maxPrice =
      tableArgs.maxPrice && isNaN(tableArgs.maxPrice)
        ? null
        : tableArgs.maxPrice;
    const dateFrom = tableArgs.dateFrom;
    const dateTo = tableArgs.dateTo;
    const newParams = new URLSearchParams();
    newParams.set("id", id !== null ? id.toString() : "");
    newParams.set("userId", userId !== null ? userId.toString() : "");
    newParams.set(
      "status",
      status !== null ? status.toString().toLowerCase() : ""
    );
    newParams.set("minPrice", minPrice !== null ? minPrice.toString() : "");
    newParams.set("maxPrice", maxPrice !== null ? maxPrice.toString() : "");
    newParams.set("dateFrom", dateFrom !== null ? dateFrom.toUTCString() : "");
    newParams.set("dateTo", dateTo !== null ? dateTo.toUTCString() : "");
    router.push(`?${newParams.toString()}`);
  }

  function clearFilters() {
    const newParams = new URLSearchParams();
    router.push(`?${newParams.toString()}`);
  }

  function nextPage() {
    if (!initialPagingArgs.nextCursor) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("cursor", initialPagingArgs.nextCursor.toString());
    router.push(`?${newParams.toString()}`);
  }

  function prevPage() {
    if (initialPagingArgs.cursor === null) return;
    router.back();
  }

  function changePageSize(newPageSize: number) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("pageSize", newPageSize.toString());
    newParams.delete("cursor");
    router.push(`?${newParams.toString()}`);
  }

  function changeSortingColumn(sortBy: string | null, ascending: boolean) {
    const newParams = new URLSearchParams(searchParams);
    if (sortBy === null) {
      newParams.delete("sortBy");
      newParams.delete("ascending");
    } else {
      newParams.set("sortBy", sortBy);
      newParams.set("ascending", ascending.toString());
    }
    newParams.delete("cursor");
    router.push(`?${newParams.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              value={tableArgs.id ?? ""}
              onChange={(e) => {
                const parsedId = parseInt(e.target.value, 10);
                if (!isNaN(parsedId)) {
                  setTableArgs((prev) => ({
                    ...prev,
                    id: parsedId,
                  }));
                }
              }}
              placeholder="type an ID to filter by"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={tableArgs.userId ?? ""}
              onChange={(e) => {
                const parsedUserId = parseInt(e.target.value, 10);
                if (!isNaN(parsedUserId)) {
                  setTableArgs((prev) => ({
                    ...prev,
                    userId: parsedUserId,
                  }));
                }
              }}
              placeholder="type a slug to filter by"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              onValueChange={(v) => {
                setTableArgs((prev) => ({
                  ...prev,
                  status: v === "null" ? null : (v as OrderStatus),
                }));
              }}
              value={tableArgs.status === null ? "null" : tableArgs.status}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">All</SelectItem>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="minPrice">Min Price (in cents)</Label>
            <Input
              id="minPrice"
              value={tableArgs.minPrice ?? ""}
              onChange={(e) => {
                const parsedMinPrice = parseInt(e.target.value, 10);
                if (!isNaN(parsedMinPrice)) {
                  setTableArgs((prev) => ({
                    ...prev,
                    minPrice: parsedMinPrice,
                  }));
                }
              }}
              placeholder="Minimum price"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="maxPrice">Max Price (in cents)</Label>
            <Input
              id="maxPrice"
              value={tableArgs.maxPrice ?? ""}
              onChange={(e) => {
                const parsedMaxPrice = parseInt(e.target.value, 10);
                if (!isNaN(parsedMaxPrice)) {
                  setTableArgs((prev) => ({
                    ...prev,
                    maxPrice: parsedMaxPrice,
                  }));
                }
              }}
              placeholder="Maximum price"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="dateFrom">Date From</Label>
            <Input
              id="dateFrom"
              type="date"
              value={tableArgs.dateFrom ? tableArgs.dateFrom.toUTCString() : ""}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                try {
                  const parsedDate = z.date().parse(newDate);
                  setTableArgs((prev) => ({
                    ...prev,
                    dateFrom: parsedDate,
                  }));
                } catch {}
              }}
              placeholder="Date from"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="dateTo">Date To</Label>
            <Input
              id="dateTo"
              type="date"
              value={tableArgs.dateTo ? tableArgs.dateTo.toUTCString() : ""}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                try {
                  const parsedDate = z.date().parse(newDate);
                  setTableArgs((prev) => ({
                    ...prev,
                    dateTo: parsedDate,
                  }));
                } catch {}
              }}
              placeholder="Date to"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-x-2 items-center justify-start">
          <Button
            disabled={!isTableArgsChanged}
            variant={"secondary"}
            onClick={() => applyFilters()}
          >
            Apply Filters
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              clearFilters();
            }}
          >
            Clear
          </Button>
        </div>
        <div className="max-w-fit flex justify-start items-center gap-x-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            disabled={initialPagingArgs.cursor === null}
            onClick={() => {
              prevPage();
            }}
          >
            Previous
          </Button>
          <Button
            variant={"secondary"}
            size={"sm"}
            disabled={initialPagingArgs.nextCursor === null}
            onClick={() => nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden">
        {data !== null && data.length > 0 ? (
          <Table className="overflow-x-scroll p-2">
            <TableHeader>
              <TableRow className="">
                {[
                  {
                    label: "ID",
                    key: "id",
                    isSortByPossible: sortableColumns.includes("id"),
                  },
                  {
                    label: "User ID",
                    key: "userId",
                    isSortByPossible: sortableColumns.includes("userId"),
                  },
                  {
                    label: "Status",
                    key: "status",
                    isSortByPossible: sortableColumns.includes("status"),
                  },
                  {
                    label: "Total",
                    key: "totalInCents",
                    isSortByPossible: sortableColumns.includes("totalInCents"),
                  },
                  {
                    label: "Created At",
                    key: "createdAt",
                    isSortByPossible: sortableColumns.includes("createdAt"),
                  },
                  {
                    label: "Updated At",
                    key: "updatedAt",
                    isSortByPossible: sortableColumns.includes("updatedAt"),
                  },
                ].map((column) => (
                  <TableHead
                    className="p-4"
                    key={column.key}
                    onClick={() => {
                      if (!column.isSortByPossible) return;
                      const nextIsAscending =
                        initialSortingArgs.sortBy === null
                          ? true
                          : initialSortingArgs.sortBy !== column.key
                          ? true
                          : initialSortingArgs.ascending === null
                          ? true
                          : initialSortingArgs.ascending === true
                          ? false
                          : null;
                      changeSortingColumn(
                        nextIsAscending === null ? null : column.key,
                        nextIsAscending === null ? true : nextIsAscending
                      );
                    }}
                  >
                    <div
                      className={cn("flex gap-x-1 justify-start items-center", {
                        "cursor-pointer hover:underline":
                          column.isSortByPossible,
                      })}
                    >
                      <span>{column.label}</span>
                      <ChevronUpIcon
                        className={cn("size-4 opacity-0", {
                          "opacity-100!":
                            initialSortingArgs.sortBy === column.key,
                          "rotate-180":
                            initialSortingArgs.sortBy === column.key &&
                            initialSortingArgs.ascending,
                        })}
                      />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order) => (
                <TableRow key={order.id} className="text-left px-2 py-1">
                  <TableCell className="px-4 py-2">{order.id}</TableCell>
                  <TableCell className="px-4 py-2">
                    {order.userId ?? "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {<OrderStatusLabel status={order.status} />}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {(order.totalInCents / 100).toFixed(2)} €
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(order.updatedAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2 flex justify-end">
                    <Link href={`/admin/orders/order-detail/${order.id}`}>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-4">No orders found.</div>
        )}
      </div>
    </div>
  );
}
