"use server";

import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/queries";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import EditCategoryPageClient from "./pageClient";

export default async function EditCategoryEditPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    notFound();
  }

  const queryClient = getQueryClient();

  const startingCursor = null;
  const startingPageSize = 10;

  await queryClient.prefetchQuery({
    queryKey: ["category", parsedId, startingCursor, startingPageSize],
    queryFn: async () =>
      await getEditCategoryQueryDocumentData(
        parsedId,
        startingCursor,
        startingPageSize
      ),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditCategoryPageClient
        id={parsedId}
        startingCursor={startingCursor}
        startingPageSize={startingPageSize}
      />
    </HydrationBoundary>
  );
}
