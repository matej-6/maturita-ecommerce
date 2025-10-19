import { getTranslations } from "next-intl/server";
import { NewCategoryForm } from "./new-category-form";
import { getDataForNewCategory } from "@/app/data-access-layer/admin/category/queries";

export default async function NewCategoryPage() {
  const newCategoryDataPromise = getDataForNewCategory();
  const t = await getTranslations("admin.categories.newCategory.page");

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl">{t("title")}</h1>
      <div className="flex flex-col max-w-2xl">
        <NewCategoryForm
          localesQueryPromise={newCategoryDataPromise}
          categoriesQueryPromise={newCategoryDataPromise}
        />
      </div>
    </div>
  );
}
