import { getTranslations } from "next-intl/server";
import { getDataForNewCategory } from "@/app/data-access-layer/admin/category/queries";
import { NewCategoryForm } from "../../forms/new-category-form";

export default async function NewCategoryPage() {
  const newCategoryDataPromise = getDataForNewCategory();
  const t = await getTranslations("admin.categories.newCategory.page");

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl mb-8">{t("title")}</h1>
      <div className="flex flex-col gap-y-8">
        <NewCategoryForm
          localesQueryPromise={newCategoryDataPromise}
          categoriesQueryPromise={newCategoryDataPromise}
        />
      </div>
    </div>
  );
}
