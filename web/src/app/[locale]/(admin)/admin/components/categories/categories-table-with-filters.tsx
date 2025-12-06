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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  ChevronUpIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

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

  const [prevCursors, setPrevCursors] = useState<(number | null)[]>([]);
  const [selectedFilterField, setSelectedFilterField] = useState<
    "id" | "parentCategoryId"
  >("parentCategoryId");

  const [idFilterValue, setIdFilterValue] = useState<string>("");
  const [slugFilterValue, setSlugFilterValue] = useState<string>("");

  useEffect(() => {
    setPrevCursors([]);
  }, [sortingArgs, tableArgs]);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-x-2">
          <Select
            value={selectedFilterField}
            onValueChange={(value) => {
              setSelectedFilterField(value as "id" | "parentCategoryId");
              setIdFilterValue("");
            }}
          >
            <SelectTrigger className="w-[196px]">
              <SelectValue placeholder="Select field to filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                onSelect={() => {
                  setTableArgs((prev) => ({
                    ...prev,
                    id: null,
                    parentCategoryId: null,
                  }));
                }}
                value="parentCategoryId"
              >
                Parent Category ID
              </SelectItem>
              <SelectItem value="id">ID</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={idFilterValue}
            onChange={(e) => setIdFilterValue(e.target.value)}
            placeholder="type an ID to filter by"
          />
        </div>
        <div className="max-w-fit flex justify-start items-center gap-x-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            disabled={prevCursors.length === 0}
            onClick={() => {
              setPagingArgs((prev) => {
                const newPrevCursors = [...prevCursors];
                const lastCursor = newPrevCursors.pop() || 0;
                setPrevCursors(newPrevCursors);
                return {
                  ...prev,
                  cursor: lastCursor === 0 ? null : lastCursor,
                };
              });
            }}
          >
            Previous
          </Button>
          <Button
            variant={"secondary"}
            size={"sm"}
            disabled={!data?.hasNextPage}
            onClick={() => {
              if (!data?.hasNextPage || !data.edges || data.edges.length === 0)
                return;
              setPagingArgs((prev) => {
                setPrevCursors((pc) => [...pc, prev.cursor]);
                return {
                  ...prev,
                  cursor: data.edges![data.edges!.length - 1].node.id,
                };
              });
            }}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="slug-filter">Slug</label>
        <Input
          id="slug-filter"
          className="w-fit"
          value={slugFilterValue}
          onChange={(e) => setSlugFilterValue(e.target.value)}
          placeholder="type a slug to filter by"
        />
      </div>
      <div className="flex gap-x-2 items-center justify-start">
        <Button
          variant={"secondary"}
          onClick={() => {
            const slug = !!slugFilterValue ? slugFilterValue : null;

            if (selectedFilterField === "parentCategoryId") {
              let id: number | null = 0;
              if (idFilterValue === "null") {
                id = null;
              } else {
                const parsedId = parseInt(idFilterValue, 10);
                id = isNaN(parsedId) ? 0 : parsedId;
              }
              setTableArgs((prev) => ({
                ...prev,
                parentCategoryId: id,
                slug: slug,
              }));
            } else {
              let id: number | null = null;
              if (idFilterValue === "null") {
                setIdFilterValue("");
              } else {
                const parsedId = parseInt(idFilterValue, 10);
                id = isNaN(parsedId) ? null : parsedId;
              }
              setTableArgs((prev) => ({
                ...prev,
                id: id,
                slug: slug,
              }));
            }
          }}
        >
          Apply Filter
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            setIdFilterValue("");
            setSlugFilterValue("");
            setTableArgs((prev) => ({
              id: null,
              isPublic: null,
              isSetup: null,
              parentCategoryId: 0,
              slug: null,
            }));
          }}
        >
          Clear
        </Button>
      </div>
      <div className="rounded-xl overflow-hidden">
        <Table className="overflow-x-scroll p-2">
          <TableHeader>
            <TableRow className="">
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
                <TableHead
                  className="p-4"
                  key={column.key}
                  onClick={() => {
                    setSortingArgs((prev) => {
                      console.log("Clicked column:", column.key);
                      if (!column.isSortByPossible) return { ...prev };
                      if (prev.sortBy === column.key) {
                        const ascending =
                          prev.ascending === null
                            ? true
                            : prev.ascending === true
                            ? false
                            : null;
                        if (ascending === null) {
                          prev.sortBy = null;
                        }
                        prev.ascending = ascending;
                      } else {
                        prev.sortBy = column.key;
                        prev.ascending = true;
                      }
                      return { ...prev };
                    });
                  }}
                >
                  <div
                    className={cn("flex gap-x-1 justify-start items-center", {
                      "cursor-pointer hover:underline": column.isSortByPossible,
                    })}
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
                  </div>
                </TableHead>
              ))}
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.edges?.map((category) => (
              <TableRow key={category.node.id} className="text-left px-2 py-1">
                <TableCell className="px-4 py-2">{category.node.id}</TableCell>
                <TableCell className="px-4 py-2">
                  {category.node.slug}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {category.node.parentCategoryId || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {category.node.productsCount}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {
                    new Date(category.node.createdAt)
                      .toLocaleString()
                      .split(",")[0]
                  }
                </TableCell>
                <TableCell className="px-4 py-2">
                  {
                    new Date(category.node.updatedAt)
                      .toLocaleString()
                      .split(",")[0]
                  }
                </TableCell>
                <TableCell className="px-4 py-2">
                  {category.node.isSetup ? "Yes" : "No"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {category.node.isPublic ? "Yes" : "No"}
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
                          href={`/category/${category.node.slug}`}
                        >
                          Visit page
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          className="grow hover:underline"
                          href={`categories/edit-category/${category.node.id}`}
                        >
                          Visit details page
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="hover:cursor-pointer hover:bg-muted transition-colors duration-150"
                        onClick={() => {
                          setSelectedFilterField("parentCategoryId");
                          setIdFilterValue(category.node.id.toString());
                          setTableArgs((prev) => ({
                            ...prev,
                            parentCategoryId: category.node.id,
                          }));
                        }}
                      >
                        Filter subcategories
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
