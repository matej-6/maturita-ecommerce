"use client";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ChevronUpIcon, MoreHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

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
  const ft = useTranslations("fields.product");
  const t = useTranslations("admin.products.table");

  const [tableArgs, setTableArgs] = useState(initialTableArgs);

  const isTableArgsChanged = useMemo(() => {
    return (
      initialTableArgs.categoryId !== tableArgs.categoryId ||
      initialTableArgs.slug !== tableArgs.slug ||
      initialTableArgs.isSetup !== tableArgs.isSetup ||
      initialTableArgs.isPublic !== tableArgs.isPublic
    );
  }, [initialTableArgs, tableArgs]);

  useEffect(() => {
    setTableArgs(initialTableArgs);
  }, [initialTableArgs]);

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
      categoryId !== null ? categoryId.toString() : "",
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

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <div>
        {!filtersOpen ? (
          <Button variant={"outline"} onClick={() => setFiltersOpen(true)}>
            {t("filters.openFiltersButton")}
          </Button>
        ) : (
          <Button variant={"outline"} onClick={() => setFiltersOpen(false)}>
            {t("filters.closeFiltersButton")}
          </Button>
        )}
      </div>
      {filtersOpen && (
        <Card className="p-2 sm:p-4 flex flex-col gap-y-4">
          <CardHeader className="p-0!">
            <CardTitle>{t("filters.title")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0! flex flex-col gap-y-4">
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="categoryId">{ft("categoryId")}</Label>
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
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="slug">{ft("slug")}</Label>
              <Input
                id="slug"
                value={tableArgs.slug ?? ""}
                onChange={(e) => {
                  setTableArgs((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label>{ft("isPublic")}</Label>
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
                  <SelectValue
                    placeholder={t("filters.isPublic.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">
                    {t("filters.isPublic.any")}
                  </SelectItem>
                  <SelectItem value="true">
                    {t("filters.isPublic.true")}
                  </SelectItem>
                  <SelectItem value="false">
                    {t("filters.isPublic.false")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label>{ft("isSetup")}</Label>
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
                  <SelectValue placeholder={t("filters.isSetup.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">
                    {t("filters.isSetup.any")}
                  </SelectItem>
                  <SelectItem value="true">
                    {t("filters.isSetup.true")}
                  </SelectItem>
                  <SelectItem value="false">
                    {t("filters.isSetup.false")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="p-0!">
            <div className="flex gap-x-2 items-center justify-start">
              <Button
                disabled={!isTableArgsChanged}
                variant={"default"}
                onClick={() => applyFilters()}
              >
                {t("filters.applyFiltersButton")}
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => {
                  clearFilters();
                }}
              >
                {t("filters.clearFiltersButton")}
              </Button>
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
                    label: ft("id"),
                    key: "id",
                  },
                  {
                    label: ft("slug"),
                    key: "slug",
                  },
                  {
                    label: ft("categoryId"),
                    key: "categoryId",
                  },
                  {
                    label: ft("createdAt"),
                    key: "createdAt",
                  },
                  {
                    label: ft("updatedAt"),
                    key: "updatedAt",
                  },
                  {
                    label: ft("isSetup"),
                    key: "isSetup",
                  },
                  {
                    label: ft("isPublic"),
                    key: "isPublic",
                  },
                ].map((column) => {
                  const isSortByPossible = sortableColumns.includes(column.key);

                  return (
                    <TableHead
                      className="p-4"
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
                          nextIsAscending === null ? true : nextIsAscending,
                        );
                      }}
                    >
                      <div
                        className={cn(
                          "flex gap-x-1 justify-start items-center",
                          {
                            "cursor-pointer hover:underline": isSortByPossible,
                          },
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
                <TableHead className="p-4">{t("actions.title")}</TableHead>
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
                    {product.isSetup ? ft("isSetupYes") : ft("isSetupNo")}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {product.isPublic ? ft("isPublicYes") : ft("isPublicNo")}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-muted-foreground">
                          {t("actions.title")}
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link
                            className="grow hover:underline"
                            href={`/product/${product.slug}`}
                          >
                            {t("actions.viewPage")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            className="grow hover:underline"
                            href={`products/product-detail/${product.id}`}
                          >
                            {t("actions.viewDetails")}
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
          <div className="py-4">{t("noItemsFound")}</div>
        )}
      </div>

      <div className="max-w-fit flex justify-start items-center gap-x-2">
        <Button
          size={"sm"}
          variant={"outline"}
          disabled={initialPagingArgs.cursor === null}
          onClick={() => {
            prevPage();
          }}
        >
          {t("pagination.prevPageButton")}
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          disabled={initialPagingArgs.nextCursor === null}
          onClick={() => nextPage()}
        >
          {t("pagination.nextPageButton")}
        </Button>
      </div>
    </div>
  );
}
