"use server";

import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/actions";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { EditCategorySheetForm } from "../../../forms/edit-category-sheet-form";
import { CategoryTranslation } from "../../../components/categories/category-translation";
import { CategoryTranslationSheetForm } from "../../../forms/category-translation-sheet-form";
import { DeleteCategoryButton } from "../../../components/categories/delete-category-button";

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

  const res = await getEditCategoryQueryDocumentData(parsedId);

  if (!res.success) {
    return (
      <div>
        <p className="text-red-500">{res.message}</p>
      </div>
    );
  }

  if (!res.data?.category) {
    notFound();
  }

  const t = await getTranslations("admin.categories.editCategory.page");
  const ft = await getTranslations("fields.category");

  const { category, locales, allProducts: products, allCategories } = res.data;

  const missingTranslations = locales.filter(
    (l) => !category.translations.some((t) => t.locale === l.code),
  );

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          <h1 className="font-medium">{t("title")}</h1>
          {!category.isSetup && (
            <Alert className="w-fit" variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{t("setupWarning.title")}</AlertTitle>
              <AlertDescription>
                <p>{t("setupWarning.description")}</p>
                <ul className="list-inside list-disc text-sm">
                  <li>{t("setupWarning.englishTranslation")}</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-wrap gap-x-24 gap-y-6">
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">
                {ft("slug")}
              </span>
              <p className="">{category.slug}</p>
            </div>
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">
                {ft("parentCategoryId")}
              </span>
              <p className="">
                {category.parentCategoryId ? (
                  <Link
                    className="hover:underline"
                    href={`/admin/categories/edit-category/${category.parentCategoryId}`}
                  >
                    ID: {category.parentCategoryId}
                  </Link>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">
                {ft("productsCount")}
              </span>
              <p>{category.productsCount}</p>
            </div>
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">
                {ft("isPublic")}
              </span>
              <p>{category.isPublic ? t("yes") : t("no")}</p>
            </div>
          </div>
          <div className="space-y-0">
            <span className="text-muted-foreground text-xs">
              {ft("subcategories")} ({category.subcategories.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.length > 0 ? (
                category.subcategories.map((s) => (
                  <Link
                    key={s.id}
                    href={`/admin/categories/edit-category/${s.id}`}
                  >
                    <Button variant={"outline"} className="gap-x-1">
                      <span>{s.slug}</span>
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </Link>
                ))
              ) : (
                <p>{t("noSubcategories")}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start gap-x-4">
          <EditCategorySheetForm
            categoryId={parsedId}
            initialData={{
              slug: category.slug,
              parentCategoryId: category.parentCategoryId ?? null,
              isPublic: category.isPublic,
            }}
            data={{ allCategories }}
          />
          <Link href={`/category/${category.slug}`}>
            <Button className="group gap-x-0.5" variant={"link"}>
              <span>{t("viewPageButton")}</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-100" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium">{t("translations.title")}</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {category.translations.map((translation) => {
            const locale = locales.find((l) => l.code === translation.locale)!;
            const localesForEdit = [locale, ...missingTranslations];

            return (
              <CategoryTranslation
                key={translation.id}
                locale={locale}
                name={translation.name}
                description={translation.description || ""}
                categoryId={parsedId}
                translationId={translation.id}
                formProps={{
                  mode: "edit",
                  categoryId: parsedId,
                  translationId: translation.id,
                  initialData: {
                    name: translation.name,
                    description: translation.description || undefined,
                    locale: translation.locale,
                  },
                  availableLocales: localesForEdit.map((l) => ({
                    label: `${l.name} (${l.flag})`,
                    value: l.code,
                  })),
                }}
              />
            );
          })}
        </div>
        <div>
          <CategoryTranslationSheetForm
            availableLocales={missingTranslations.map((t) => ({
              label: t.name,
              value: t.code,
            }))}
            mode="create"
            categoryId={parsedId}
          />
        </div>
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium">{t("products.title")}</h2>
        <div className="flex flex-wrap gap-4">
          {!products || products.length === 0 ? (
            <p>{t("products.noProducts")}</p>
          ) : (
            products.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/product-detail/${p.id}`}
                className="flex"
              >
                <Button variant={"secondary"} className="gap-x-1 grow">
                  <span>{p.slug}</span>
                  <ArrowUpRight className="size-4" />
                </Button>
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div>
        <DeleteCategoryButton categoryId={parsedId} />
      </div>
    </div>
  );
}
