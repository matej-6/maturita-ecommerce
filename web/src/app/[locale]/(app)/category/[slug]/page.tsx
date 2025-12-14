"use server";

import { getCategoryQueryData } from "@/app/data-access-layer/category.queries";
import { getImageSrc } from "@/app/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { PrevButton } from "@/components/prev-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductFilters } from "@/components/product-filters";
import { group } from "console";
import { ProductFiltersSheet } from "@/components/product-filters-sheet";
import { AddToCartButton } from "@/components/add-to-cart-button";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
// este dokoncit pageSize
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

  let pageSize = 25;
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
    attributes.length > 0 ? attributes : undefined
  );
  if (!queryRes.success) {
    return <div>{queryRes.message}</div>;
  }

  if (queryRes.data?.category == null) {
    return notFound();
  }

  const category = queryRes.data.category;

  let nextPageLink = null;
  if (category.categoryProductVariants.hasNextPage) {
    const nextCursor =
      category.categoryProductVariants.edges![
        category.categoryProductVariants.edges!.length - 1
      ].cursor;
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
        : sp[attr.key!.key] ?? [];

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

  return (
    <div className="max-width-container bg-base/50 w-full mx-auto mt-8 gap-y-8 flex flex-col relative">
      {/* {groupedAttributes.size > 0 && (
        <div className="absolute -left-12 -translate-x-full hidden min-[1920px]:block">
          <Card className="w-[216px]">
            <CardHeader>
              <CardTitle className="font-medium text-center">Filters</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-6">
              <ProductFilters
                baseUrl={`/category/${slug}`}
                attributes={groupedAttributes}
              />
            </CardContent>
          </Card>
        </div>
      )} */}
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-4">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-secondary-foreground">{category.description}</p>
        </div>
        {category.subcategories.length > 0 && (
          <div className="flex flex-col gap-y-2">
            <h2 className="font-medium text-secondary-foreground">
              Subcategories
            </h2>
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
      <div className="h-0.5 w-full bg-accent my-4" />
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
                return (
                  <Card key={productVariant.sku} className="w-[296px]">
                    <CardHeader className="flex h-[256px]">
                      {image ? (
                        <img
                          src={getImageSrc(image.mimeType, image.base64)}
                          alt={productVariant.sku + " image"}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="bg-accent size-full flex items-center justify-center">
                          <span className="text-muted-foreground">
                            No Image
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-4">
                      <div className="h-[96px]">
                        <Link
                          className="group"
                          href={`/product/${productVariant.product.slug}?variant=${productVariant.sku}`}
                        >
                          <div className="flex flex-col gap-y-1">
                            <CardTitle className="group-hover:underline">
                              {productVariant.product.name}{" "}
                              {productVariant.attributes
                                .map((a) => a.translatedValue || a.value)
                                .sort()
                                .join(" ")}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground text-pretty line-clamp-3">
                              {productVariant.product.description}
                            </p>
                          </div>
                        </Link>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p className="font-medium text-xl">
                          {(productVariant.priceInCents / 100).toFixed(2)}€
                        </p>
                      </div>
                      <AddToCartButton productVariantId={productVariant.id}>
                        Add to Cart
                      </AddToCartButton>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="flex items-center justify-start gap-x-2">
              <PrevButton
                size={"sm"}
                disabled={cursor == null}
                className="items-center"
              >
                <ArrowLeftIcon className="size-3.5" />
                <span>Previous</span>
              </PrevButton>
              {!!nextPageLink ? (
                <Link href={nextPageLink}>
                  <Button size={"sm"} className="items-center">
                    <span>Next</span>
                    <ArrowRightIcon className="size-3.5" />
                  </Button>
                </Link>
              ) : (
                <Button size={"sm"} disabled className="items-center">
                  <span>Next</span>
                  <ArrowRightIcon className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
