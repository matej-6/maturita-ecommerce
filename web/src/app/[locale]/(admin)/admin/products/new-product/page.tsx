"use server";

import { getDataForNewProductPage } from "@/app/data-access-layer/admin/product/actions";
import { getTranslations } from "next-intl/server";
import { ProductForm } from "../../forms/product-sheet-form";

export default async function NewProductPage() {
  const newProductDataPromise = await getDataForNewProductPage();
  const t = await getTranslations("admin.products.newProduct.page");

  if (!newProductDataPromise.success) {
    return (
      <div className="text-red-500">
        Failed to load data for new product page
      </div>
    );
  }

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl mb-8">{t("title")}</h1>
      <div className="flex flex-col gap-y-8">
        <ProductForm
          mode="create"
          categories={newProductDataPromise.data.categories}
        />
      </div>
    </div>
  );
}
