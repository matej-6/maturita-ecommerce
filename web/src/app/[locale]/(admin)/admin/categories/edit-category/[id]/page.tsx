import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/queries";
import { getTranslations } from "next-intl/server";

export default async function EditCategoryEditPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const res = await getEditCategoryQueryDocumentData(id);

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl mb-8"></h1>
      <div className="flex flex-col gap-y-8"></div>
    </div>
  );
}
