"use client";

import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/queries";
import { handleGraphqlError } from "@/app/data-access-layer/admin/handleGraphqlFormError";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useRouter } from "@/i18n/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircleIcon, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategoryTranslationSheetForm } from "../../../forms/category-translation-sheet-form";
import { CategoryTranslation } from "../../../components/categories/category-translation";
import { useState } from "react";
import { EditCategorySheetForm } from "../../../forms/edit-category-sheet-form";

export default function EditCategoryPageClient({
  id,
  startingCursor,
  startingPageSize,
}: {
  id: number;
  startingCursor: number | null;
  startingPageSize: number;
}) {
  const router = useRouter();
  const t = useTranslations("admin.categories.editCategory.page");

  const [productCursor, setProductCursor] = useState<number | null>(
    startingCursor
  );
  const [productPageSize, setProductPageSize] = useState(startingPageSize);
  const previousPageCursors: (number | null)[] = [];
  const queryKey = ["category", id, productCursor, productPageSize];

  const { data } = useSuspenseQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await getEditCategoryQueryDocumentData(
        id,
        productCursor,
        productPageSize
      );
      if (res.errors) {
        const error = await handleGraphqlError(res.errors);
        toast.error(error.message);
        router.push("/admin/categories");
      }

      return res;
    },
  });

  if (!data.data) {
    return notFound();
  }

  const missingTranslations = data.data.locales.filter(
    (l) => !data.data?.category.translations?.some((t) => t.locale === l.code)
  );

  return (
    <div className="flex flex-col flex-1 gap-y-10">
      <div className="flex flex-col gap-y-8">
        <div className="space-y-8">
          <h1 className="font-medium font-secondary">Overview</h1>
          {!data.data.category.isSetup && (
            <Alert className="w-fit" variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{t("setupWarning.title")}</AlertTitle>
              <AlertDescription>
                <p>{t("setupWarning.description")}</p>
                <ul className="list-inside list-disc text-sm">
                  <li>{t("setupWarning.englishTranslation")}</li>
                  <li>{t("setupWarning.atLeastOneVisibleProduct")}</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-wrap gap-x-24 gap-y-6">
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">Slug</span>
              <p className="">{data.data.category.slug}</p>
            </div>
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">
                Parent Category
              </span>
              <p className="">
                {data.data.category.parentCategoryId ? (
                  <Link
                    className="hover:underline"
                    href={`/admin/categories/edit-category/${data.data.category.parentCategoryId}`}
                  >
                    ID: {data.data.category.parentCategoryId}
                  </Link>
                ) : (
                  "None"
                )}
              </p>
            </div>
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">
                Nu. of products
              </span>
              <p>{data.data.category.productsCount}</p>
            </div>
            <div className="flex flex-col gap-y-0">
              <span className="text-muted-foreground text-xs">Is Public</span>
              <p>{data.data.category.isPublic ? "Yes" : "No"}</p>
            </div>
          </div>
          <div className="space-y-0">
            <span className="text-muted-foreground text-xs">
              Subcategories ({data.data.category.subcategories.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {data.data.category.subcategories.length > 0 ? (
                data.data.category.subcategories.map((s) => (
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
                <p>No subcategories</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start gap-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-fit">Edit category</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit category</SheetTitle>
                <SheetDescription>
                  Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4">
                  <EditCategorySheetForm
                    refetchQueryKey={queryKey}
                    categoriesQuery={data}
                    categoryId={id}
                    initialData={{
                      slug: data.data.category.slug,
                      parentCategoryId:
                        data.data.category.parentCategoryId || null,
                    }}
                  />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
          <Link href={`/category/${data.data.category.slug}`}>
            {" "}
            <Button className="group gap-x-0.5" variant={"link"}>
              <span>View page</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-100" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="space-y-8">
        <h2 className="font-medium font-secondary">Translations</h2>

        <div className="flex gap-8">
          {data.data.category.translations?.map((translation) => {
            const locale = data.data?.locales.find(
              (l) => l.code === translation.locale
            );

            const availableLocales = [locale!, ...missingTranslations];

            return (
              <CategoryTranslation
                locale={locale!}
                name={translation.name}
                description={translation.description || ""}
                translationId={translation.id}
                key={locale!.code}
                refetchKey={queryKey}
                formProps={{
                  mode: "edit",
                  translationId: translation.id,
                  refetchQueryKey: queryKey,
                  initialData: {
                    name: translation.name,
                    description: translation.description || undefined,
                    locale: translation.locale,
                  },
                  availableLocales: availableLocales.map((l) => ({
                    label: `${l.name} ${l.flag}`,
                    value: l.code,
                  })),
                }}
              />
            );
          })}
        </div>
        <CategoryTranslationSheetForm
          availableLocales={missingTranslations.map((t) => ({
            label: t.name,
            value: t.code,
          }))}
          mode="create"
          categoryId={id}
          refetchQueryKey={queryKey}
        />
      </div>
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="space-y-8">
        <h2 className="font-medium font-secondary">Products</h2>
        <div className="flex flex-col gap-y-4">
          {data.data.products.edges?.length === 0 ? (
            <p>No products in this category.</p>
          ) : (
            data.data.products.edges!.map(({ node }) => (
              <Card key={node.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{node.name ?? "No name translation"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Slug: {node.slug}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/admin/products/edit-product/${node.id}`}>
                    <Button asChild variant={"link"} className="gap-x-1">
                      <div>
                        <span>Edit product</span>
                        <ArrowUpRight className="size-4" />
                      </div>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        {data.data.products.edges && data.data.products.edges.length > 0 && (
          <div className="space-x-2">
            <Button
              size={"sm"}
              disabled={previousPageCursors.length === 0}
              onClick={() => {
                const prevCursor = previousPageCursors.pop()!;
                setProductCursor(prevCursor);
              }}
            >
              Previous Page
            </Button>
            <Button
              size={"sm"}
              disabled={!data.data.products.hasNextPage}
              onClick={() => {
                setProductCursor((prev) => {
                  previousPageCursors.push(prev);
                  return data.data!.products.edges![
                    data.data!.products.edges!.length - 1
                  ]!.cursor!;
                });
              }}
            >
              Next Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
