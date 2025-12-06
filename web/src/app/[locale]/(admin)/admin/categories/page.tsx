"use server";

import { getCategoriesTableDataAction } from "@/app/data-access-layer/admin/category/actions";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getQueryClient } from "@/lib/get-query-client";
import { CategoriesTableWithFilters } from "../components/categories/categories-table-with-filters";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function CategoriesPage() {
  const initialSortingArgs = {
    ascending: null,
    sortBy: null,
  };

  const initialTableArgs = {
    id: null,
    slug: null,
    parentCategoryId: 0,
    isSetup: null,
    isPublic: null,
  };

  const initialPagingArgs = {
    cursor: null,
    pageSize: 25,
  };

  const queryClient = getQueryClient();
  const queryKey = [
    "categories",
    { ...initialTableArgs, ...initialPagingArgs, ...initialSortingArgs },
  ];
  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await getCategoriesTableDataAction(
        initialPagingArgs,
        initialSortingArgs,
        initialTableArgs
      );
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <Link href={"categories/new-category"}>
            <Button>Add New Category</Button>
          </Link>
        </div>
        <div className="bg-muted/50 dark:bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col">
          <CategoriesTableWithFilters
            initialPagingArgs={initialPagingArgs}
            initialSortingArgs={initialSortingArgs}
            initialTableArgs={initialTableArgs}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
