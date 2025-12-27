"use server";

import { getProductsPageData } from "@/app/data-access-layer/admin/product/queries";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ProductsTableWithFilters } from "../components/products/product-table-with-filters";
import { AttributeKeySortingField, OrderStatus } from "@/graphql/graphql";
import z from "zod";
import {
  PagingArgs,
  SortingArgs,
  FilterArgs,
} from "@/app/data-access-layer/admin/product-variant-attribute/queries";
import { OrdersTableWithFilters } from "../components/orders/orders-table-with-filters";
import { getPagedAttributeKeysQuery } from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { AttributeKeysTableWithFilters } from "../components/attribute-keys/attribute-keys-table-with-filters";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function AttributeKeysPage({ searchParams }: Props) {
  const sp = await searchParams;

  function parseSortBy(value: string): SortingArgs["sortBy"] {
    switch (value) {
      case AttributeKeySortingField.Id:
        return AttributeKeySortingField.Id;
      case AttributeKeySortingField.Key:
        return AttributeKeySortingField.Key;
      case AttributeKeySortingField.CreatedAt:
        return AttributeKeySortingField.CreatedAt;
      default:
        return null;
    }
  }

  const sortingArgs: SortingArgs = {
    ascending: null,
    sortBy: null,
  };

  const tableArgs: FilterArgs = {
    id: null,
    key: null,
  };

  const pagingArgs: PagingArgs & { nextCursor: number | null } = {
    cursor: null,
    nextCursor: null,
    pageSize: 25,
  };

  sortingArgs.ascending =
    sp.ascending === "true" ? true : sp.ascending === "false" ? false : null;

  sortingArgs.sortBy =
    typeof sp.sortBy === "string" ? parseSortBy(sp.sortBy) : null;

  pagingArgs.cursor =
    typeof sp.cursor === "string" ? parseInt(sp.cursor, 10) || null : null;
  pagingArgs.pageSize =
    typeof sp.pageSize === "string" ? parseInt(sp.pageSize, 10) || 25 : 25;

  if (typeof sp.id === "string") {
    const parsedId = parseInt(sp.id, 10);
    tableArgs.id = isNaN(parsedId) ? null : parsedId;
  }

  tableArgs.id =
    typeof sp.id === "string"
      ? isNaN(parseInt(sp.id, 10))
        ? null
        : parseInt(sp.id, 10)
      : null;

  tableArgs.key = typeof sp.key === "string" ? sp.key : null;

  const data = await getPagedAttributeKeysQuery({
    ...pagingArgs,
    ...sortingArgs,
    ...tableArgs,
  });

  pagingArgs.nextCursor =
    data.success &&
    data.data?.findAllPaginatedProductVariantAttributeKeys.hasNextPage
      ? data.data.findAllPaginatedProductVariantAttributeKeys.edges?.slice(
          -1
        )[0].cursor ?? null
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
    ...(tableArgs.key ? { key: tableArgs.key.toString() } : {}),
  });

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="bg-muted/25 dark:bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col">
        <AttributeKeysTableWithFilters
          initialPagingArgs={pagingArgs}
          initialSortingArgs={sortingArgs}
          initialTableArgs={tableArgs}
          searchParams={urlSearchParams.toString()}
          sortableColumns={Object.values(AttributeKeySortingField)}
          data={
            data.success
              ? data.data?.findAllPaginatedProductVariantAttributeKeys.edges?.map(
                  (k) => ({
                    id: k.node.id,
                    key: k.node.key,
                    createdAt: new Date(k.node.createdAt),
                    updatedAt: new Date(k.node.updatedAt),
                  })
                ) || null
              : null
          }
        />
      </div>
    </div>
  );
}
