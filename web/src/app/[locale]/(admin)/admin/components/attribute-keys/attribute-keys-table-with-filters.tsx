"use client";

import {
  PagingArgs,
  SortingArgs,
  FilterArgs,
} from "@/app/data-access-layer/admin/product-variant-attribute/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { AttributeKeySortingField } from "@/graphql/graphql";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortableColumns,
  data,
}: Props) {
  const t = useTranslations("admin.attributeKeys.table");
  const ft = useTranslations("fields.attributeKey");

  const [tableArgs, setTableArgs] = useState(initialTableArgs);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const isTableArgsChanged = useMemo(() => {
    return (
      initialTableArgs.id !== tableArgs.id ||
      initialTableArgs.key !== tableArgs.key
    );
  }, [tableArgs, initialTableArgs]);

  useEffect(() => {
    setTableArgs(initialTableArgs);
  }, [initialTableArgs]);

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
    <div className="flex flex-col gap-y-4">
      <div>
        {!isFiltersOpen ? (
          <Button variant={"outline"} onClick={() => setIsFiltersOpen(true)}>
            {t("filters.openFiltersButton")}
          </Button>
        ) : (
          <Button variant={"outline"} onClick={() => setIsFiltersOpen(false)}>
            {t("filters.closeFiltersButton")}
          </Button>
        )}
      </div>
      {isFiltersOpen && (
        <Card className="flex flex-col gap-y-4 p-2 sm:p-4">
          <CardHeader className="p-0!">
            <CardTitle>{t("filters.title")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4 p-0!">
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="id">{ft("id")}</Label>
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
              <Label htmlFor="key">{ft("key")}</Label>
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
              />
            </div>
          </CardContent>
          <CardFooter className="p-0!">
            <div className="flex gap-x-2 items-center justify-start">
              <Button
                disabled={!isTableArgsChanged}
                variant={"secondary"}
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
                    sortingKey: AttributeKeySortingField.Id,
                  },
                  {
                    label: ft("key"),
                    key: "key",
                    sortingKey: AttributeKeySortingField.Key,
                  },
                  {
                    label: ft("createdAt"),
                    key: "createdAt",
                    sortingKey: AttributeKeySortingField.CreatedAt,
                  },
                  {
                    label: ft("updatedAt"),
                    key: "updatedAt",
                    sortingKey: AttributeKeySortingField.UpdatedAt,
                  },
                ].map((column) => (
                  <TableHead
                    className="p-4"
                    key={column.key}
                    onClick={() => {
                      if (!column.sortingKey) return;
                      const nextIsAscending =
                        initialSortingArgs.sortBy === null
                          ? true
                          : initialSortingArgs.sortBy !== column.sortingKey
                            ? true
                            : initialSortingArgs.ascending === null
                              ? true
                              : initialSortingArgs.ascending === true
                                ? false
                                : null;
                      changeSortingColumn(
                        nextIsAscending === null ? null : column.sortingKey,
                        nextIsAscending === null ? true : nextIsAscending,
                      );
                    }}
                  >
                    <div
                      className={cn("flex gap-x-1 justify-start items-center", {
                        "cursor-pointer hover:underline": !!column.sortingKey,
                      })}
                    >
                      <span>{column.label}</span>
                      <ChevronUpIcon
                        className={cn("size-4 opacity-0", {
                          "opacity-100!":
                            initialSortingArgs.sortBy === column.sortingKey,
                          "rotate-180":
                            initialSortingArgs.sortBy === column.sortingKey &&
                            initialSortingArgs.ascending,
                        })}
                      />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="p-4 text-right">
                  {t("actions.label")}
                </TableHead>
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
                      <Button variant="default" size="sm">
                        {t("actions.viewDetails")}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-4">{t("noAttributeKeysFound")}</div>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          size={"sm"}
          variant={"outline"}
          disabled={initialPagingArgs.cursor === null}
          onClick={() => {
            prevPage();
          }}
        >
          {t("pagination.buttons.previous")}
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          disabled={initialPagingArgs.nextCursor === null}
          onClick={() => nextPage()}
        >
          {t("pagination.buttons.next")}
        </Button>
      </div>
    </div>
  );
}
