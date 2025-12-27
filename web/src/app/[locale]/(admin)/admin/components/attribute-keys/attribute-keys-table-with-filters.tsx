"use client";

import {
  PagingArgs,
  SortingArgs,
  FilterArgs,
} from "@/app/data-access-layer/admin/product-variant-attribute/queries";
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
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  initialPagingArgs: PagingArgs & {
    nextCursor: number | null;
  };
  initialSortingArgs: SortingArgs;
  initialTableArgs: FilterArgs;
  searchParams: string;
  data:
    | {
        id: number;
        key: string;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null;
  sortableColumns: string[];
};

export function AttributeKeysTableWithFilters({
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
        initialTableArgs.key !== tableArgs.key
    );
  }, [tableArgs, initialTableArgs]);

  const router = useRouter();

  function applyFilters() {
    const id = tableArgs.id && isNaN(tableArgs.id) ? null : tableArgs.id;
    const key = tableArgs.key;
    const newParams = new URLSearchParams();
    newParams.set("id", id !== null ? id.toString() : "");
    newParams.set("key", key !== null ? key.toString() : "");

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
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              value={tableArgs.key ?? ""}
              onChange={(e) => {
                const k = e.target.value;
                if (k !== null) {
                  setTableArgs((prev) => ({
                    ...prev,
                    key: k,
                  }));
                }
              }}
              placeholder="type a key to filter by"
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
                    key: "ID",
                  },
                  {
                    label: "Key",
                    key: "KEY",
                  },
                  {
                    label: "Created At",
                    key: "CREATED_AT",
                  },
                  {
                    label: "Updated At",
                    key: "UPDATED_AT",
                  },
                ].map((column) => (
                  <TableHead
                    className="p-4"
                    key={column.key}
                    onClick={() => {
                      if (!sortableColumns.includes(column.key)) return;
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
                          sortableColumns.includes(column.key),
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
              {data.map((keys) => (
                <TableRow key={keys.id} className="text-left px-2 py-1">
                  <TableCell className="px-4 py-2">{keys.id}</TableCell>
                  <TableCell className="px-4 py-2">{keys.key}</TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(keys.updatedAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(keys.createdAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2 flex justify-end">
                    <Link href={`/admin/attribute-keys/key-detail/${keys.id}`}>
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
          <div className="py-4">No attribute keys found.</div>
        )}
      </div>
    </div>
  );
}
