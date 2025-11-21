"use server";

import {
  getProductDetailPageData,
  ProductDetailPageQueryDocument,
} from "@/app/data-access-layer/admin/product/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { execute } from "@/graphql/execute";
import { Link } from "@/i18n/navigation";
import { AlertCircleIcon, ArrowUpRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductForm } from "../../../forms/product-form";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return (
      <div className="text-red-500">Invalid product ID provided in query.</div>
    );
  }

  const res = await getProductDetailPageData(parsedId);
  if (!res.success) {
    return <div>{res.message}</div>;
  }

  if (!res.data?.product) {
    return notFound();
  }

  const locale = await getLocale();

  const revalidatePathUrls = [
    `/${locale}/admin/products/product-detail/${id}`,
    `/${locale}/admin/products`,
  ];

  const { product, categories, locales } = res.data;
  const missingTranslations = locales.filter(
    (l) => !product.translations.some((t) => t.locale === l.code)
  );

  const t = await getTranslations("admin.products.productDetail.page");

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl mb-8">Product Detail - ID: {id}</h1>
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          <h1 className="font-medium font-secondary">Overview</h1>
          {!product.isSetup && (
            <Alert className="w-fit" variant={"destructive"}>
              <AlertCircleIcon />
              <AlertTitle>{t("setupWarning.title")}</AlertTitle>
              <AlertDescription>
                <p>{t("setupWarning.description")}</p>
                <ul className="list-inside list-disc text-sm">
                  <li>{t("setupWarning.englishTranslation")}</li>
                  <li>{t("setupWarning.atLeastOneVisibleVariant")}</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="grid grid-cols-3 gap-6 w-3xl">
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Slug</span>
              <p>{product.slug}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Category ID</span>
              <p>
                {product.categoryId ? (
                  <Link
                    href={`/admin/categories/edit-category/${product.categoryId}`}
                  >
                    {product.categoryId}
                  </Link>
                ) : (
                  "None"
                )}
              </p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Is Setup</span>
              <p>{product.isSetup ? "Yes" : "No"}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Is Public</span>
              <p>{product.isPublic ? "Yes" : "No"}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Created At</span>
              <p>{new Date(product.createdAt).toLocaleString()}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Updated At</span>
              <p>{new Date(product.updatedAt).toLocaleString()}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">
                Nu. of variants
              </span>
              <p>{product.variants.length}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start gap-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-fit">Edit</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit product</SheetTitle>
                <SheetDescription>
                  Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4">
                  <ProductForm
                    categories={categories}
                    mode="edit"
                    initialData={{
                      slug: product.slug,
                      categoryId: product.categoryId || null,
                      isPublic: product.isPublic,
                    }}
                    revalidatePaths={revalidatePathUrls}
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
          <Link href={`/product/${product.slug}`}>
            <Button className="group gap-x-0.5" variant={"link"}>
              <span>View page</span>
              <ArrowUpRightIcon className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-100" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium font-secondary">Translations</h2>
        <div className="flex gap-8">
          {product.translations.map((t) => {
            const locale = locales.find((l) => l.code === t.locale);

            const availableLocales = [locale!, ...missingTranslations];
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
