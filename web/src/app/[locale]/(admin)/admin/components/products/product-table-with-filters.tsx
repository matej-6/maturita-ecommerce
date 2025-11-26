"use client";

import { getCategoriesTableDataAction } from "@/app/data-access-layer/admin/category/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  ChevronUpIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  initialPagingArgs: {
    pageSize: number;
    cursor: number | null;
    nextCursor: number | null;
  };
  initialSortingArgs: {
    ascending: boolean | null;
    sortBy: string | null;
  };
  initialTableArgs: {
    categoryId: number | null;
    slug: string | null;
    isSetup: boolean | null;
    isPublic: boolean | null;
  };
  searchParams: string;
  data:
    | {
        id: number;
        slug: string;
        categoryId: number | null;
        createdAt: string;
        updatedAt: string;
        isSetup: boolean;
        isPublic: boolean;
      }[]
    | null;
  sortableColumns: string[];
};

export function ProductsTableWithFilters({
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
      initialTableArgs.categoryId !== tableArgs.categoryId ||
        initialTableArgs.slug !== tableArgs.slug ||
        initialTableArgs.isSetup !== tableArgs.isSetup ||
        initialTableArgs.isPublic !== tableArgs.isPublic
    );
  }, [tableArgs, initialTableArgs]);

  const router = useRouter();

  function applyFilters() {
    const slug = !!tableArgs.slug ? tableArgs.slug : null;
    const parsedCategoryId = parseInt(`${tableArgs.categoryId}`, 10);
    const categoryId = isNaN(parsedCategoryId) ? null : parsedCategoryId;
    const isSetup = tableArgs.isSetup;
    const isPublic = tableArgs.isPublic;
    const newParams = new URLSearchParams();
    newParams.set("slug", slug ?? "");
    newParams.set(
      "categoryId",
      categoryId !== null ? categoryId.toString() : ""
    );
    newParams.set("isSetup", isSetup !== null ? isSetup.toString() : "");
    newParams.set("isPublic", isPublic !== null ? isPublic.toString() : "");
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
            <Label htmlFor="categoryId">Category ID</Label>
            <Input
              id="categoryId"
              value={tableArgs.categoryId ?? ""}
              onChange={(e) => {
                const parsedId = parseInt(e.target.value, 10);
                if (!isNaN(parsedId)) {
                  setTableArgs((prev) => ({
                    ...prev,
                    categoryId: parsedId,
                  }));
                }
              }}
              placeholder="type an ID to filter by"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={tableArgs.slug ?? ""}
              onChange={(e) => {
                setTableArgs((prev) => ({
                  ...prev,
                  slug: e.target.value,
                }));
              }}
              placeholder="type a slug to filter by"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label>Is Public</Label>
            <Select
              onValueChange={(v) => {
                setTableArgs((prev) => ({
                  ...prev,
                  isPublic: v === "null" ? null : v === "true" ? true : false,
                }));
              }}
              value={
                tableArgs.isPublic === null
                  ? "null"
                  : tableArgs.isPublic
                  ? "true"
                  : "false"
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select setup status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label>Is Setup</Label>
            <Select
              onValueChange={(v) => {
                setTableArgs((prev) => ({
                  ...prev,
                  isSetup: v === "null" ? null : v === "true" ? true : false,
                }));
              }}
              value={
                tableArgs.isSetup === null
                  ? "null"
                  : tableArgs.isSetup
                  ? "true"
                  : "false"
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select setup status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
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
            Apply Filter
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
                    label: "Slug",
                    key: "slug",
                    isSortByPossible: sortableColumns.includes("slug"),
                  },
                  {
                    label: "Category ID",
                    key: "categoryId",
                    isSortByPossible: sortableColumns.includes("categoryId"),
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
                  {
                    label: "Is Setup",
                    key: "isSetup",
                    isSortByPossible: sortableColumns.includes("isSetup"),
                  },
                  {
                    label: "Is Public",
                    key: "isPublic",
                    isSortByPossible: sortableColumns.includes("isPublic"),
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
              {data.map((product) => (
                <TableRow key={product.id} className="text-left px-2 py-1">
                  <TableCell className="px-4 py-2">{product.id}</TableCell>
                  <TableCell className="px-4 py-2">{product.slug}</TableCell>
                  <TableCell className="px-4 py-2">
                    {product.categoryId || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(product.createdAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(product.updatedAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {product.isSetup ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {product.isPublic ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-muted-foreground">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link
                            className="grow hover:underline"
                            href={`/product/${product.slug}`}
                          >
                            Visit page
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            className="grow hover:underline"
                            href={`products/product-detail/${product.id}`}
                          >
                            Visit details page
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-4">No products available</div>
        )}
      </div>
    </div>
  );
}
