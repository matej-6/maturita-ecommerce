"use client";

import {
  CategoreisPagingArgs,
  CategoriesFilterArgs,
  CategoriesSortingArgs,
} from "@/app/data-access-layer/admin/category/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ChevronUpIcon, MoreHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type CategoriesTableWithFiltersProps = {
  initialPagingArgs: CategoreisPagingArgs & {
    nextCursor: number | null;
  };
  initialSortingArgs: CategoriesSortingArgs;
  initialTableArgs: CategoriesFilterArgs;
  searchParams: string;
  data:
    | {
        id: number;
        slug: string;
        parentCategoryId: number | null;
        productsCount: number;
        createdAt: Date;
        updatedAt: Date;
        isSetup: boolean;
        isPublic: boolean;
      }[]
    | null;
  sortableColumns: string[];
};

export function CategoriesTableWithFilters({
  initialPagingArgs,
  initialSortingArgs,
  initialTableArgs,
  data,
  searchParams,
  sortableColumns,
}: CategoriesTableWithFiltersProps) {
  const ft = useTranslations("fields");
  const t = useTranslations("admin.categories");

  const [tableArgs, setTableArgs] = useState(initialTableArgs);

  useEffect(() => {
    setTableArgs(initialTableArgs);
  }, [initialTableArgs]);

  const isTableArgsChanged = useMemo(() => {
    return (
      initialTableArgs.id !== tableArgs.id ||
      initialTableArgs.parentCategoryId !== tableArgs.parentCategoryId ||
      initialTableArgs.slug !== tableArgs.slug ||
      initialTableArgs.isPublic !== tableArgs.isPublic ||
      initialTableArgs.isSetup !== tableArgs.isSetup
    );
  }, [initialTableArgs, tableArgs]);

  const router = useRouter();

  function applyFilters() {
    const id = tableArgs.id && isNaN(tableArgs.id) ? null : tableArgs.id;
    const parentCategoryId =
      tableArgs.parentCategoryId === null
        ? null
        : isNaN(tableArgs.parentCategoryId)
        ? 0
        : tableArgs.parentCategoryId;
    const slug = tableArgs.slug || null;
    const isPublic = tableArgs.isPublic;
    const isSetup = tableArgs.isSetup;

    const params = new URLSearchParams();
    params.set("id", id !== null ? id.toString() : "");
    params.set(
      "parentCategoryId",
      parentCategoryId !== null ? parentCategoryId.toString() : "null"
    );
    params.set("slug", slug !== null ? slug : "");
    params.set(
      "isPublic",
      isPublic === null ? "" : isPublic ? "true" : "false"
    );
    params.set("isSetup", isSetup === null ? "" : isSetup ? "true" : "false");

    router.push(`?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    router.push(`?${params.toString()}`);
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

  function changeSortingColumn(col: string | null, ascending: boolean) {
    const newParams = new URLSearchParams(searchParams);
    if (col === null) {
      newParams.delete("sortBy");
      newParams.delete("ascending");
    } else {
      newParams.set("sortBy", col);
      newParams.set("ascending", ascending.toString());
    }
    newParams.delete("cursor");
    router.push(`?${newParams.toString()}`);
  }

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {!filtersOpen ? (
        <Button variant={"outline"} onClick={() => setFiltersOpen(true)}>
          {t("table.filters.openFilters")}
        </Button>
      ) : (
        <Button variant={"outline"} onClick={() => setFiltersOpen(false)}>
          {t("table.filters.closeFilters")}
        </Button>
      )}
      {filtersOpen && (
        <Card className={"p-2 sm:p-4 flex flex-col gap-y-4"}>
          <CardHeader className="p-0!">
            <CardTitle>{t("table.filters.title")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0! flex flex-col gap-y-4">
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="id">{ft("category.id")}</Label>
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
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="parent-category-id">
                {ft("category.parentCategoryId")}
              </Label>
              <Input
                id="parent-category-id"
                value={
                  tableArgs.parentCategoryId === 0
                    ? ""
                    : tableArgs.parentCategoryId === null
                    ? "null"
                    : tableArgs.parentCategoryId
                }
                onChange={(e) => {
                  if (e.target.value === "") {
                    setTableArgs((prev) => ({
                      ...prev,
                      parentCategoryId: null,
                    }));
                  } else {
                    const parsedId = parseInt(e.target.value, 10);
                    if (!isNaN(parsedId)) {
                      setTableArgs((prev) => ({
                        ...prev,
                        parentCategoryId: parsedId,
                      }));
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="slug">{ft("category.slug")}</Label>
              <Input
                id="slug"
                value={tableArgs.slug === null ? "" : tableArgs.slug}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setTableArgs((prev) => ({
                      ...prev,
                      slug: null,
                    }));
                  } else {
                    setTableArgs((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }));
                  }
                }}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="is-public">{ft("category.isPublic")}</Label>
              <Select
                value={
                  tableArgs.isPublic === null
                    ? "any"
                    : tableArgs.isPublic
                    ? "true"
                    : "false"
                }
                onValueChange={(value) => {
                  if (value === "any") {
                    setTableArgs((prev) => ({
                      ...prev,
                      isPublic: null,
                    }));
                  } else if (value === "true") {
                    setTableArgs((prev) => ({
                      ...prev,
                      isPublic: true,
                    }));
                  } else {
                    setTableArgs((prev) => ({
                      ...prev,
                      isPublic: false,
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{ft("category.isPublic")}</SelectLabel>
                    <SelectItem value="any">
                      {t("table.filters.isPublicSelect.any")}
                    </SelectItem>
                    <SelectItem value="true">
                      {t("table.filters.isPublicSelect.true")}
                    </SelectItem>
                    <SelectItem value="false">
                      {t("table.filters.isPublicSelect.false")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="is-setup">{ft("category.isSetup")}</Label>
              <Select
                value={
                  tableArgs.isSetup === null
                    ? "any"
                    : tableArgs.isSetup
                    ? "true"
                    : "false"
                }
                onValueChange={(value) => {
                  if (value === "any") {
                    setTableArgs((prev) => ({
                      ...prev,
                      isSetup: null,
                    }));
                  } else if (value === "true") {
                    setTableArgs((prev) => ({
                      ...prev,
                      isSetup: true,
                    }));
                  } else {
                    setTableArgs((prev) => ({
                      ...prev,
                      isSetup: false,
                    }));
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{ft("category.isSetup")}</SelectLabel>

                    <SelectItem value="any">
                      {t("table.filters.isSetupSelect.any")}
                    </SelectItem>
                    <SelectItem value="true">
                      {t("table.filters.isSetupSelect.true")}
                    </SelectItem>
                    <SelectItem value="false">
                      {t("table.filters.isSetupSelect.false")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="p-0!">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-x-2 items-center justify-start">
                <Button
                  disabled={!isTableArgsChanged}
                  variant={"secondary"}
                  onClick={() => applyFilters()}
                >
                  {t("table.filters.applyFilters")}
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    clearFilters();
                  }}
                >
                  {t("table.filters.clearFilters")}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}

      <div className="rounded-xl overflow-hidden">
        {data !== null && data.length > 0 ? (
          <Table className="overflow-x-scroll p-2">
            <TableHeader>
              <TableRow className="">
                {[
                  {
                    label: ft("category.id"),
                    key: "id",
                  },
                  {
                    label: ft("category.slug"),
                    key: "slug",
                  },
                  {
                    label: ft("category.parentCategoryId"),
                    key: "parentCategoryId",
                  },
                  {
                    label: ft("category.productsCount"),
                    key: "productsCount",
                  },

                  {
                    label: ft("category.createdAt"),
                    key: "createdAt",
                  },
                  {
                    label: ft("category.updatedAt"),
                    key: "updatedAt",
                  },
                  {
                    label: ft("category.isSetup"),
                    key: "isSetup",
                  },
                  {
                    label: ft("category.isPublic"),
                    key: "isPublic",
                  },
                ].map((column) => {
                  const isSortByPossible = sortableColumns.includes(column.key);
                  return (
                    <TableHead
                      className="p-2 sm:p-4"
                      key={column.key}
                      onClick={() => {
                        if (!isSortByPossible) return;
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
                        className={cn(
                          "flex gap-x-1 justify-start items-center",
                          {
                            "cursor-pointer hover:underline": isSortByPossible,
                          }
                        )}
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
                  );
                })}
                <TableHead className="sr-only">
                  {t("table.actions.title")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((category) => (
                <TableRow key={category.id} className="text-left px-2 py-1">
                  <TableCell className="px-2 sm:px-4 py-2">
                    {category.id}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    {category.slug}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    {category.parentCategoryId || "N/A"}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    {category.productsCount}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    {
                      new Date(category.createdAt)
                        .toLocaleString()
                        .split(",")[0]
                    }
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    {
                      new Date(category.updatedAt)
                        .toLocaleString()
                        .split(",")[0]
                    }
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    {category.isSetup ? t("table.yes") : t("table.no")}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    {category.isPublic ? t("table.yes") : t("table.no")}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">
                            {t("table.actions.title")}
                          </span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-muted-foreground">
                          {t("table.actions.title")}
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link
                            className="grow hover:underline"
                            href={`/category/${category.slug}`}
                          >
                            {t("table.actions.visitPage")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            className="grow hover:underline"
                            href={`categories/edit-category/${category.id}`}
                          >
                            {t("table.actions.edit")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="hover:cursor-pointer hover:bg-muted transition-colors duration-150"
                          onClick={() => {
                            setTableArgs((prev) => ({
                              ...prev,
                              parentCategoryId: category.id,
                            }));
                          }}
                        >
                          {t("table.filterSubcategories")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-4">{t("table.noRecordsFound")}</div>
        )}
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
          {t("table.previous")}
        </Button>
        <Button
          variant={"secondary"}
          size={"sm"}
          disabled={initialPagingArgs.nextCursor === null}
          onClick={() => nextPage()}
        >
          {t("table.next")}
        </Button>
      </div>
    </div>
  );
}
