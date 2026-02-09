"use server";

import { AttributeKeySortingField } from "@/graphql/graphql";
import {
  PagingArgs,
  SortingArgs,
  FilterArgs,
} from "@/app/data-access-layer/admin/product-variant-attribute/queries";
import { getPagedAttributeKeysQuery } from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { AttributeKeysTableWithFilters } from "../components/attribute-keys/attribute-keys-table-with-filters";
import { AttributeKeySheetForm } from "../forms/attribute-key-sheet-form";

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
      case AttributeKeySortingField.UpdatedAt:
        return AttributeKeySortingField.UpdatedAt;
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

  pagingArgs.nextCursor = data.success
    ? (data.data?.findAllPaginatedProductVariantAttributeKeys.nextCursor ??
      null)
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
    <div className="flex-1 flex flex-col gap-y-4">
      <div>
        <AttributeKeySheetForm />
      </div>
      <div className="flex-1 flex flex-col">
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
                  }),
                ) || null
              : null
          }
        />
      </div>
    </div>
  );
}
