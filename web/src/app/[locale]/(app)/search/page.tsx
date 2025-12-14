"use server";

import { getSearchProductsQueryData } from "@/app/data-access-layer/search.queries";
import { getImageSrc } from "@/app/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PrevButton } from "@/components/prev-button";
import { ProductFiltersSheet } from "@/components/product-filters-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
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

  const query = sp.q;
  if (typeof query !== "string" || query.trim() === "") {
    return (
      <div className="max-width-container bg-base/50 w-full mx-auto mt-8">
        No products found
      </div>
    );
  }

  const res = await getSearchProductsQueryData(
    query,
    cursor,
    pageSize,
    attributes
  );
  if (!res.success) {
    return (
      <div className="max-width-container bg-base/50 w-full mx-auto mt-8 gap-y-8">
        Unable to fetch products.
      </div>
    );
  }

  const productVariants = res.data?.searchProductVariants;

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

  res.data?.productVariantAttributes.forEach((pva) => {
    if (!groupedAttributes.has(pva.key!.key)) {
      groupedAttributes.set(pva.key!.key, {
        keyTranslation: pva.key!.translatedKey || undefined,
        values: new Set(),
      });
    }

    groupedAttributes.get(pva.key!.key)?.values.add({
      value: pva.value,
      translatedValue: pva.translatedValue || undefined,
      isSet: attributes.some(
        (a) => a[0] === pva.key!.key && a[1] === pva.value
      ),
    });
  });

  let nextPageLink = null;
  if (productVariants?.hasNextPage) {
    const nextCursor =
      productVariants.edges![productVariants.edges!.length - 1].cursor;
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("cursor", nextCursor.toString());
    params.append("pageSize", pageSize.toString());
    nextPageLink = `/search?${params.toString()}`;
  }

  return (
    <div className="max-width-container bg-base/50 w-full mx-auto mt-8 gap-y-8 flex flex-col relative">
      <h1 className="text-4xl font-bold">
        Showing search results for: "{query}"
      </h1>
      {groupedAttributes.size > 0 && (
        <div className="">
          <ProductFiltersSheet
            productFilterProps={{
              attributes: groupedAttributes,
              baseUrl: `/search`,
              searchParams: new URLSearchParams({ q: query }),
            }}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        {productVariants &&
        productVariants.edges &&
        productVariants.edges.length > 0 ? (
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-wrap gap-4">
              {productVariants.edges.map((pv) => {
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
            No products found for this search.
          </div>
        )}
      </div>
    </div>
  );
}
