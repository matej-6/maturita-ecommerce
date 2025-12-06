"use server";

import { getCategoryQueryData } from "@/app/data-access-layer/category.queries";
import { getImageSrc } from "@/app/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

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

  const productVariants = category.categoryProducts.edges?.map((e) => {
    const product = e.node;
    return product.variants.map((v) => ({
      ...v,
      productName: product.name,
      productDescription: product.description,
      productSlug: product.slug,
      productThumbnailImage: product.thumbnailImage,
    }));
  });

  return (
    <div className="max-width-container bg-base/50 w-full mx-auto mt-8 gap-y-8 flex flex-col">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-4">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-lg">{category.description}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <h2 className="text-xl font-medium">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((s) => (
              <Link key={s.slug} href={`/category/${s.slug}`}>
                <Button variant={"secondary"}>{s.name || s.slug}</Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {category.categoryProducts.edges?.map((p) => {
          const product = p.node;
          return product.variants.map((pv) => {
            const image = pv.thumbnailImage || product.thumbnailImage || null;
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
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-y-2">
                  <div className="flex flex-col gap-y-1 h-[96px]">
                    <CardTitle>{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground text-pretty line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex-col flex gap-y-1 text-sm h-[96px]">
                    {pv.attributes.map((attr) => (
                      <p key={attr.key?.key}>
                        <span className="text-muted-foreground capitalize">
                          {attr.key?.translatedKey ?? attr.key?.key}:
                        </span>{" "}
                        <span>{attr.translatedValue ?? attr.value}</span>
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p className="font-medium text-xl">
                      {(pv.priceInCents / 100).toFixed(2)}€
                    </p>
                  </div>
                  <div></div>
                </CardContent>
              </Card>
            );
          });
        })}
      </div>
    </div>
  );
}
