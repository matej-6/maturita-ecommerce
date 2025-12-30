"use server";

import {
  CategoreisPagingArgs,
  CategoriesFilterArgs,
  CategoriesSortingArgs,
  getCategoriesTableDataAction,
} from "@/app/data-access-layer/admin/category/actions";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { CategoriesTableWithFilters } from "../components/categories/categories-table-with-filters";
import { NewCategoryFormSheet } from "../forms/new-cateogry-form-sheet";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function CategoriesPage({ searchParams }: Props) {
  const sp = await searchParams;

  const sortingArgs: CategoriesSortingArgs = {
    ascending:
      sp.ascending === "true" ? true : sp.ascending === "false" ? false : null,
    sortBy: typeof sp.sortBy === "string" ? sp.sortBy : null,
  };

  const tableArgs: CategoriesFilterArgs = {
    id: typeof sp.id === "string" ? parseInt(sp.id, 10) || null : null,
    slug: typeof sp.slug === "string" ? sp.slug : null,
    parentCategoryId:
      sp.parentCategoryId === "null"
        ? null
        : typeof sp.parentCategoryId === "string"
        ? parseInt(sp.parentCategoryId, 10) ?? 0
        : 0,
    isSetup:
      sp.isSetup === "true" ? true : sp.isSetup === "false" ? false : null,
    isPublic:
      sp.isPublic === "true" ? true : sp.isPublic === "false" ? false : null,
  };

  const pagingArgs: CategoreisPagingArgs & {
    nextCursor: number | null;
  } = {
    cursor:
      typeof sp.cursor === "string" ? parseInt(sp.cursor, 10) ?? null : null,
    pageSize:
      typeof sp.pageSize === "string" ? parseInt(sp.pageSize, 10) ?? 25 : 25,
    nextCursor: null,
  };

  const data = await getCategoriesTableDataAction(
    pagingArgs,
    sortingArgs,
    tableArgs
  );

  if (!data.success) {
    return <div>Error loading data...</div>;
  }

  const paginatedCategories = data.data?.paginatedCategories;
  const allCategories = data.data?.allCategories;

  pagingArgs.nextCursor =
    data.success && paginatedCategories?.hasNextPage
      ? paginatedCategories.edges?.slice(-1)[0].cursor ?? null
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
    ...(tableArgs.slug ? { slug: tableArgs.slug.toString() } : {}),
    ...(tableArgs.parentCategoryId
      ? { parentCategoryId: tableArgs.parentCategoryId.toString() }
      : {}),
    ...(tableArgs.isSetup !== null
      ? { isSetup: tableArgs.isSetup.toString() }
      : {}),
    ...(tableArgs.isPublic !== null
      ? { isPublic: tableArgs.isPublic.toString() }
      : {}),
  });

  return (
    <div className="flex-1 flex flex-col gap-4 ">
      <div>
        <NewCategoryFormSheet categories={allCategories ?? []} />
      </div>
      <div className=" min-h-[100vh] flex-1 md:min-h-min flex flex-col">
        <CategoriesTableWithFilters
          initialPagingArgs={pagingArgs}
          initialSortingArgs={sortingArgs}
          initialTableArgs={tableArgs}
          searchParams={urlSearchParams.toString()}
          sortableColumns={[
            "id",
            "slug",
            "isPublic",
            "isSetup",
            "createdAt",
            "updatedAt",
            "productsCount",
          ]}
          data={
            paginatedCategories
              ? paginatedCategories.edges?.map((c) => ({
                  id: c.node.id,
                  slug: c.node.slug,
                  parentCategoryId: c.node.parentCategoryId || null,
                  isPublic: c.node.isPublic,
                  isSetup: c.node.isSetup,
                  createdAt: new Date(c.node.createdAt),
                  updatedAt: new Date(c.node.updatedAt),
                  productsCount: c.node.productsCount,
                })) || null
              : null
          }
        />
      </div>
    </div>
  );
}
