"use server";

import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/queries";
import { getTranslations } from "next-intl/server";
import { EditCategoryForm } from "../edit-category-form";
import {
  GraphQLErrorExtensions,
  handleGraphqlError,
} from "@/app/data-access-layer/admin/handleGraphqlFormError";
import { notFound } from "next/navigation";

export default async function EditCategoryEditPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const res = await getEditCategoryQueryDocumentData(id);

  if (res.errors) {
    const error = await handleGraphqlError(res.errors);
    throw new Error(error.message);
  }

  if (!res.data) {
    return notFound();
  }

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl mb-8">Edit category</h1>
      <div className="flex flex-col gap-y-8">
        <EditCategoryForm
          categoriesQuery={res}
          categoryId={id}
          data={{
            slug: res.data.category.slug,
            parentCategoryId: res.data.category.parentCategoryId || "",
          }}
        />
      </div>
    </div>
  );
}
