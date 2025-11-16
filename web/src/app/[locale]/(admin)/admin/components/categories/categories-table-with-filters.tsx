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
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronUp,
  ChevronUpIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useState } from "react";

type CategoriesTableWithFiltersProps = {
  initialPagingArgs: {
    cursor: number | null;
    pageSize: number;
  };
  initialSortingArgs: {
    ascending: boolean | null;
    sortBy: string | null;
  };
  initialTableArgs: {
    id: number | null;
    slug: string | null;
    parentCategoryId: number | null;
    isSetup: boolean | null;
    isPublic: boolean | null;
  };
};

export function CategoriesTableWithFilters({
  initialPagingArgs,
  initialSortingArgs,
  initialTableArgs,
}: CategoriesTableWithFiltersProps) {
  const [pagingArgs, setPagingArgs] = useState(initialPagingArgs);
  const [sortingArgs, setSortingArgs] = useState(initialSortingArgs);
  const [tableArgs, setTableArgs] = useState(initialTableArgs);

  const { data, error } = useQuery({
    queryKey: ["categories", { ...tableArgs, ...pagingArgs, ...sortingArgs }],
    queryFn: async () => {
      const res = await getCategoriesTableDataAction(
        pagingArgs,
        sortingArgs,
        tableArgs
      );
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
  });

  if (error) {
    return (
      <div className="text-red-500">
        Error loading categories: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden">
        <Table className="overflow-x-scroll">
          <TableHeader>
            <TableRow className="px-4 mt-10 py-2">
              {[
                {
                  label: "ID",
                  key: "id",
                  isSortByPossible: true,
                },
                {
                  label: "Slug",
                  key: "slug",
                  isSortByPossible: true,
                },
                {
                  label: "Parent Category ID",
                  key: "parentCategoryId",
                  isSortByPossible: true,
                },
                {
                  label: "Products Count",
                  key: "productsCount",
                  isSortByPossible: true,
                },

                {
                  label: "Created At",
                  key: "createdAt",
                  isSortByPossible: true,
                },
                {
                  label: "Updated At",
                  key: "updatedAt",
                  isSortByPossible: true,
                },
                {
                  label: "Is Setup",
                  key: "isSetup",
                  isSortByPossible: true,
                },
                {
                  label: "Is Public",
                  key: "isPublic",
                  isSortByPossible: true,
                },
              ].map((column) => (
                <th className="text-left" key={column.key}>
                  <Button
                    onClick={() => {
                      setSortingArgs((prev) => {
                        console.log("Clicked column:", column.key);
                        if (!column.isSortByPossible) return { ...prev };
                        if (prev.sortBy === column.key) {
                          prev.ascending =
                            prev.ascending === null
                              ? true
                              : prev.ascending === true
                              ? false
                              : null;
                          if (prev.ascending === null) {
                            prev.sortBy = null;
                          }
                        } else {
                          prev.sortBy = column.key;
                          prev.ascending = true;
                        }
                        return { ...prev };
                      });
                    }}
                    className="py-1 px-1"
                    variant={"ghost"}
                  >
                    <span>{column.label}</span>
                    <ChevronUpIcon
                      className={cn("size-4 opacity-0", {
                        "opacity-100!": sortingArgs.sortBy === column.key,
                        "rotate-180":
                          sortingArgs.sortBy === column.key &&
                          sortingArgs.ascending,
                      })}
                    />
                  </Button>
                </th>
              ))}
              <th className="sr-only">Actions</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.edges?.map((category) => (
              <TableRow key={category.node.id} className="text-left px-2 py-1">
                <td className="pl-3 py-1 flex items-center justify-start gap-x-1">
                  <span>{category.node.id}</span>
                  <Link href={`categories/edit-category/${category.node.id}`}>
                    <Button className="gap-x-0.5" variant={"link"}>
                      <span>Details</span>
                      <ArrowUpRightIcon className="size-3" />
                    </Button>
                  </Link>
                </td>
                <td className="pl-3 py-1">{category.node.slug}</td>
                <td className="pl-3 py-1">
                  {category.node.parentCategoryId || "N/A"}
                </td>
                <td className="pl-3 py-1">{category.node.productsCount}</td>
                <td className="pl-3 py-1">
                  {
                    new Date(category.node.createdAt)
                      .toLocaleString()
                      .split(",")[0]
                  }
                </td>
                <td className="pl-3 py-1">
                  {
                    new Date(category.node.updatedAt)
                      .toLocaleString()
                      .split(",")[0]
                  }
                </td>
                <td className="pl-3 py-1">
                  {category.node.isSetup ? "Yes" : "No"}
                </td>
                <td className="pl-3 py-1">
                  {category.node.isPublic ? "Yes" : "No"}
                </td>
                <td className="pl-3 py-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={``}>Go to page</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={``}>Details page</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Filter subcategories</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
