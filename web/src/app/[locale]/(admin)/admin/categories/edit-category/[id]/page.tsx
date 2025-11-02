"use server";

import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/queries";
import { getTranslations } from "next-intl/server";
import { EditCategoryForm } from "../edit-category-form";
import { handleGraphqlError } from "@/app/data-access-layer/admin/handleGraphqlFormError";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
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

  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["category", id],
    queryFn: async () => await getEditCategoryQueryDocumentData(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditCategoryPageClient id={id} />
    </HydrationBoundary>
  );
}
