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

  const queryRes = await getCategoryQueryData(slug, cursor, pageSize);
  if (!queryRes.success) {
    return <div>{queryRes.message}</div>;
  }

  if (queryRes.data?.category == null) {
    return notFound();
  }

  const category = queryRes.data.category;

  let nextPageLink = null;
  if (category.categoryProducts.hasNextPage) {
    const nextCursor =
      category.categoryProducts.edges![
        category.categoryProducts.edges!.length - 1
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
      values: Set<{ value: string; translatedValue?: string }>;
    }
  > = new Map();

  category.categoryProducts.edges?.forEach((edge) => {
    edge.node.variants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (!groupedAttributes.has(attr.key!.key)) {
          groupedAttributes.set(attr.key!.key, {
            values: new Set(),
            keyTranslation: attr.key!.translatedKey || undefined,
          });
        }
        groupedAttributes.get(attr.key!.key)!.values!.add({
          value: attr.value,
          translatedValue: attr.translatedValue || undefined,
        });
      });
    });
  });

  return (
    <div className="max-width-container bg-base/50 w-full mx-auto mt-8 gap-y-8 flex flex-col relative">
      <div className="absolute -left-12 -translate-x-full hidden min-[1920px]:block">
        <Card className="w-[216px]">
          <CardHeader>
            <CardTitle className="font-medium text-center">Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-6">
            {Array.from(groupedAttributes.entries()).map(([key, value]) => {
              const selectedValues = new Set<string>();
              if (typeof sp[key] === "string") {
                selectedValues.add(sp[key] as string);
              } else if (Array.isArray(sp[key])) {
                sp[key].forEach((v) => selectedValues.add(v));
              }

              return (
                <div key={key} className="flex flex-col gap-y-2">
                  <h3 className="font-medium text-secondary-foreground capitalize">
                    {value.keyTranslation || key}
                  </h3>
                  <div className="flex flex-col gap-y-1">
                    {Array.from(value.values).map((v) => (
                      <div key={v.value} className="flex items-center gap-x-2">
                        <input
                          id={`${key}-${v.value}`}
                          className="justify-start text-sm"
                          type="checkbox"
                          defaultChecked={selectedValues.has(v.value)}
                          onChange={() => {
                            if (selectedValues.has(v.value)) {
                              selectedValues.delete(v.value);
                            } else {
                              selectedValues.add(v.value);
                            }
                            const params = new URLSearchParams();
                            for (const key of Object.keys(sp)) {
                              if (typeof sp[key] === "string") {
                                params.append(key, sp[key] as string);
                              } else if (Array.isArray(sp[key])) {
                                sp[key].forEach((v) => params.append(key, v));
                              }
                            }

                            params.delete("cursor");
                            params.delete("pageSize");
                            params.delete(key);
                            selectedValues.forEach((val) => {
                              params.append(key, val);
                            });

                            router.push(
                              `/category/${slug}?${params.toString()}`
                            );

                            // osamostatnit do komponentu a 'use client'
                          }}
                        />
                        <Label
                          htmlFor={`${key}-${v.value}`}
                          className="text-sm"
                        >
                          {v.translatedValue || v.value}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
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
        {category.categoryProducts.edges &&
        category.categoryProducts.edges.length > 0 ? (
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-wrap gap-4">
              {category.categoryProducts.edges.map((p) => {
                const product = p.node;
                return product.variants.map((pv) => {
                  const image =
                    pv.thumbnailImage || product.thumbnailImage || null;
                  return (
                    <Card key={pv.sku} className="w-[296px]">
                      <CardHeader className="flex h-[256px]">
                        {image ? (
                          <img
                            src={getImageSrc(image.mimeType, image.base64)}
                            alt={pv.sku + " image"}
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
                            href={`/product/${product.slug}`}
                          >
                            <div className="flex flex-col gap-y-1">
                              <CardTitle className="group-hover:underline">
                                {product.name}{" "}
                                {pv.attributes
                                  .map((a) => a.translatedValue || a.value)
                                  .sort()
                                  .join(" ")}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground text-pretty line-clamp-3">
                                {product.description}
                              </p>
                            </div>
                          </Link>
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <p className="font-medium text-xl">
                            {(pv.priceInCents / 100).toFixed(2)}€
                          </p>
                        </div>
                        <Button>Add to Cart</Button>
                      </CardContent>
                    </Card>
                  );
                });
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
