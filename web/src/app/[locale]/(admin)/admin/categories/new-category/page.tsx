import { getLocalesQuery } from "@/app/data-access-layer/admin/locale.queries";
import { NewCategoryForm } from "./new-category-form";

export default function NewCategoryPage() {
  const localesPromise = getLocalesQuery();

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl">Add a New Category</h1>
      <div className="flex flex-col max-w-2xl">
        <NewCategoryForm localesPromise={localesPromise} />
      </div>
    </div>
  );
}
