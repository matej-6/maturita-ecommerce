"use server";

import { getProductsPageData } from "@/app/data-access-layer/admin/product/queries";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ProductsTableWithFilters } from "../components/products/product-table-with-filters";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

type PagingArgs = {
  cursor: number | null;
  nextCursor: number | null;
  pageSize: number;
};

type SortingArgs = {
  ascending: boolean | null;
  sortBy: string | null;
};

type TableArgs = {
  categoryId: number | null;
  slug: string | null;
  isSetup: true | false | null;
  isPublic: true | false | null;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const sortingArgs: SortingArgs = {
    ascending: null,
    sortBy: null,
  };

  const tableArgs: TableArgs = {
    slug: null,
    isSetup: null,
    isPublic: null,
    categoryId: null,
  };

  const pagingArgs: PagingArgs = {
    cursor: null,
    nextCursor: null,
    pageSize: 25,
  };

  sortingArgs.ascending =
    sp.ascending === "true" ? true : sp.ascending === "false" ? false : null;

  sortingArgs.sortBy = typeof sp.sortBy === "string" ? sp.sortBy : null;

  pagingArgs.cursor =
    typeof sp.cursor === "string" ? parseInt(sp.cursor, 10) || null : null;
  pagingArgs.pageSize =
    typeof sp.pageSize === "string" ? parseInt(sp.pageSize, 10) || 25 : 25;

  tableArgs.slug = typeof sp.slug === "string" ? sp.slug : null;

  tableArgs.isSetup =
    sp.isSetup === "true" ? true : sp.isSetup === "false" ? false : null;

  tableArgs.isPublic =
    sp.isPublic === "true" ? true : sp.isPublic === "false" ? false : null;

  tableArgs.categoryId =
    typeof sp.categoryId === "string"
      ? isNaN(parseInt(sp.categoryId, 10))
        ? null
        : parseInt(sp.categoryId, 10)
      : null;

  const productsPageData = await getProductsPageData(
    pagingArgs,
    sortingArgs,
    tableArgs
  );

  pagingArgs.nextCursor =
    productsPageData.success && productsPageData.data?.products.hasNextPage
      ? productsPageData.data.products.edges?.slice(-1)[0].cursor ?? null
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
    ...(tableArgs.slug ? { slug: tableArgs.slug } : {}),
    ...(tableArgs.isSetup !== null
      ? { isSetup: tableArgs.isSetup.toString() }
      : {}),
    ...(tableArgs.isPublic !== null
      ? { isPublic: tableArgs.isPublic.toString() }
      : {}),
    ...(tableArgs.categoryId
      ? { categoryId: tableArgs.categoryId.toString() }
      : {}),
  });

  return (
    <div className="flex-1 flex flex-col gap-4">
      <Link href={"products/new-product"}>
        <Button className="w-fit">Add New Product</Button>
      </Link>
      <div className="bg-muted/25 dark:bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col">
        <ProductsTableWithFilters
          initialPagingArgs={pagingArgs}
          initialSortingArgs={sortingArgs}
          initialTableArgs={tableArgs}
          searchParams={urlSearchParams.toString()}
          sortableColumns={[
            "id",
            "categoryId",
            "slug",
            "createdAt",
            "updatedAt",
          ]}
          data={
            productsPageData.success
              ? productsPageData.data?.products.edges?.map((p) => ({
                  id: p.node.id,
                  categoryId: p.node.categoryId ?? null,
                  createdAt: p.node.createdAt,
                  updatedAt: p.node.updatedAt,
                  isPublic: p.node.isPublic,
                  isSetup: p.node.isSetup,
                  slug: p.node.slug,
                })) || null
              : null
          }
        />
      </div>
    </div>
  );
}
