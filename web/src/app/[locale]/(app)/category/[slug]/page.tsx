"use server";

import { getCategoryQueryData } from "@/app/data-access-layer/category.queries";
import { getImageSrc } from "@/app/lib/utils";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { PrevButton } from "@/components/prev-button";
import { ProductFiltersSheet } from "@/components/product-filters-sheet";
import { ProductVariantCard } from "@/components/product-variant-card";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  let cursor: number | null = null;
  if (typeof sp.cursor === "string") {
    const parsedCursor = parseInt(sp.cursor, 10);
    if (!isNaN(parsedCursor)) {
      cursor = parsedCursor;
    }
  }

  let pageSize = 10;
  if (typeof sp.pageSize === "string") {
    const parsedPageSize = parseInt(sp.pageSize, 10);
    if (!isNaN(parsedPageSize)) {
      pageSize = parsedPageSize;
    }
  }
  if (!slug) {
    return notFound();
  }

  const attributes: string[][] = [];
  Object.entries(sp).forEach(([key, value]) => {
    if (
      key !== "cursor" &&
      key !== "pageSize" &&
      typeof value !== "undefined"
    ) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          attributes.push([key, v]);
        });
      } else {
        attributes.push([key, value]);
      }
    }
  });

  const queryRes = await getCategoryQueryData(
    slug,
    cursor,
    pageSize,
    attributes.length > 0 ? attributes : undefined,
  );
  if (!queryRes.success) {
    return <div>{queryRes.message}</div>;
  }

  if (queryRes.data?.category == null) {
    return notFound();
  }

  const category = queryRes.data.category;

  let nextPageLink = null;
  const nextCursor = queryRes.data.category.categoryProductVariants.nextCursor;
  if (nextCursor) {
    const params = new URLSearchParams();
    params.append("cursor", nextCursor.toString());
    params.append("pageSize", pageSize.toString());
    nextPageLink = `/category/${slug}?${params.toString()}`;
  }

  const groupedAttributes: Map<
    string,
    {
      keyTranslation?: string;
      values: Set<{
        value: string;
        translatedValue?: string;
        isSet: boolean;
      }>;
    }
  > = new Map();

  category.usedProductVariantAttributes.forEach((attr) => {
    const setAttributesForKey =
      typeof sp[attr.key!.key] === "string"
        ? [sp[attr.key!.key]]
        : (sp[attr.key!.key] ?? []);

    if (!groupedAttributes.has(attr.key!.key)) {
      groupedAttributes.set(attr.key!.key, {
        values: new Set(),
        keyTranslation: attr.key!.translatedKey || undefined,
      });
    }

    groupedAttributes.get(attr.key!.key)!.values!.add({
      value: attr.value,
      translatedValue: attr.translatedValue || undefined,
      isSet: setAttributesForKey.includes(attr.value),
    });
  });

  const t = await getTranslations("categoryPage");
  const pt = await getTranslations("pagination");

  return (
    <div className="max-width-container  w-full mx-auto py-6 sm:py-12 gap-y-6 sm:gap-y-12 flex flex-col relative">
      <div className="flex flex-col gap-y-2 sm:gap-y-4">
        <div className="flex flex-col gap-y-1 sm:gap-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold">{category.name}</h1>
          <p className="text-accent-foreground text-lg sm:text-xl">
            {category.description}
          </p>
        </div>
        {category.subcategories.length > 0 && (
          <div className="flex flex-col gap-y-1 sm:gap-y-2">
            <h2 className="text-accent-foreground">{t("subcategories")}</h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((s) => (
                <Link key={s.slug} href={`/category/${s.slug}`}>
                  <Button variant={"secondary"}>{s.name || s.slug}</Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="h-0.5 w-full bg-accent" />
      <div className="flex flex-wrap gap-4">
        {category.categoryProductVariants.edges &&
        category.categoryProductVariants.edges.length > 0 ? (
          <div className="flex flex-col gap-y-8">
            {groupedAttributes.size > 0 && (
              <div className="">
                <ProductFiltersSheet
                  productFilterProps={{
                    attributes: groupedAttributes,
                    baseUrl: `/category/${slug}`,
                  }}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-4">
              {category.categoryProductVariants.edges.map((pv) => {
                const productVariant = pv.node;
                const image =
                  productVariant.thumbnailImage ||
                  productVariant.product.thumbnailImage ||
                  null;
                const name =
                  productVariant.product.name +
                  " " +
                  productVariant.attributes
                    .map((a) => a.translatedValue || a.value)
                    .sort()
                    .join(" ");
                return (
                  <ProductVariantCard
                    key={productVariant.id}
                    variant={{
                      ...productVariant,
                      imageUrl: getImageSrc(image?.url),
                      productSlug: productVariant.product.slug,
                      name: name,
                      description: productVariant.product.description || "",
                    }}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-start gap-x-2">
              <PrevButton
                size={"sm"}
                disabled={cursor == null}
                className="items-center"
              />
              {!!nextPageLink ? (
                <Link href={nextPageLink}>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="items-center"
                  >
                    <span>{pt("next")}</span>
                    <ArrowRightIcon className="size-3.5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size={"sm"}
                  disabled
                  variant={"outline"}
                  className="items-center"
                >
                  <span>{pt("next")}</span>
                  <ArrowRightIcon className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-lg">
            {t("noProductsFound")}
          </div>
        )}
      </div>
    </div>
  );
}
