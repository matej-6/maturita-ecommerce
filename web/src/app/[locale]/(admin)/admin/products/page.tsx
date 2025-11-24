"use server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

type PagingArgs = {
  cursor: number | null;
  pageSize: number;
};

type SortingArgs = {
  ascending: boolean | null;
  sortBy: string | null;
};

type TableArgs = {
  slug: string | null;
  categoryId: number | null;
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
    pageSize: 25,
  };

  sortingArgs.ascending =
    sp.ascending === "true" ? true : sp.ascending === "false" ? false : null;

  sortingArgs.sortBy = typeof sp.sortBy === "string" ? sp.sortBy : null;

  pagingArgs.cursor =
    typeof sp.cursor === "string" ? parseInt(sp.cursor, 10) || null : null;
  pagingArgs.pageSize =
    typeof sp.pageSize === "string" ? parseInt(sp.pageSize, 10) || 25 : 25;

  tableArgs.categoryId =
    typeof sp.categoryId === "string"
      ? parseInt(sp.categoryId, 10) || null
      : null;

  tableArgs.slug = typeof sp.slug === "string" ? sp.slug : null;

  tableArgs.isSetup =
    sp.isSetup === "true" ? true : sp.isSetup === "false" ? false : null;

  tableArgs.isPublic =
    sp.isPublic === "true" ? true : sp.isPublic === "false" ? false : null;

  return (
    <div className="flex-1 flex flex-col gap-4">
      <Link href={"products/new-product"}>
        <Button className="w-fit">Add New Product</Button>
      </Link>
      <div className="bg-muted dark:bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col"></div>
    </div>
  );
}
