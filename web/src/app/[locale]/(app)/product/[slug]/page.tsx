"use server";

import { getProductPageData } from "@/app/data-access-layer/product.queries";
import { getImageSrc } from "@/app/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImages } from "@/components/product-images";
import { ProductVariantsScroll } from "@/components/product-variants-scroll";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link, redirect } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowLeftIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }

  const sp = await searchParams;
  const variant = typeof sp.variant === "string" ? sp.variant : null;

  const data = await getProductPageData(slug);
  if (
    !data.success ||
    !data.data?.productBySlug ||
    data.data.productBySlug.variants.length === 0
  ) {
    return notFound();
  }

  const locale = await getLocale();

  const t = await getTranslations("productPage");

  if (variant === null) {
    const newSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (typeof value === "undefined") {
        continue;
      }
      const values = Array.isArray(value) ? value : [value];
      values.forEach((v) => newSearchParams.append(key, v));
    }
    newSearchParams.set("variant", data.data.productBySlug.variants[0].sku);
    redirect({
      href: `/product/${slug}?${newSearchParams.toString()}`,
      locale: locale,
    });
  }

  const selectedVariant = data.data.productBySlug.variants.find(
    (v) => v.sku === variant
  );
  if (!selectedVariant) {
    return notFound();
  }

  const thumbnailImage =
    selectedVariant.images.find((i) => i.isThumbnail) ||
    data.data.productBySlug.images.find((i) => i.isThumbnail);

  const allImages = [
    ...selectedVariant.images,
    ...data.data.productBySlug.images,
  ].map((image) => ({
    url: getImageSrc(image.mimeType, image.base64),
    altText: data.data!.productBySlug?.name || slug,
    id: image.id,
  }));

  const otherVariants = data.data.productBySlug.variants
    .filter((v) => v.sku !== selectedVariant.sku)
    .map((v) => {
      const variantName = v.attributes
        .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
        .map((attr) => attr.value)
        .join(", ");

      const thumbnail = v.images.find((i) => i.isThumbnail) || thumbnailImage;
      return {
        id: v.id,
        productSlug: slug,
        sku: v.sku,
        name: (data.data?.productBySlug?.name ?? slug) + " " + variantName,
        priceInCents: v.priceInCents,
        imageUrl: thumbnail
          ? getImageSrc(thumbnail.mimeType, thumbnail.base64)
          : undefined,
      };
    });

  const variantName = selectedVariant.attributes
    .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
    .map((attr) => attr.value)
    .join(", ");
  return (
    <div className="max-width-container w-full mx-auto mt-6 sm:mt-12 gap-y-6 sm:gap-y-12 flex flex-col relative items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-8 gap-x-8">
        <ProductImages
          images={allImages}
          thumbnailImage={
            thumbnailImage
              ? {
                  url: getImageSrc(
                    thumbnailImage.mimeType,
                    thumbnailImage.base64
                  ),
                  altText: data.data!.productBySlug?.name || slug,
                  id: thumbnailImage.id,
                }
              : undefined
          }
        />
        <div className="flex flex-col gap-y-5 sm:gap-y-8">
          <h1 className="text-3xl lg:text-4xl font-medium">
            {data.data.productBySlug.name ?? slug} {variantName}
          </h1>
          {data.data.productBySlug.description && (
            <div className="flex flex-col gap-y-1">
              <h2 className="text-muted-foreground text-sm font-medium">
                Description
              </h2>
              <p className="text-secondary-foreground text-base">
                {data.data.productBySlug.description}
              </p>
            </div>
          )}
          {otherVariants.length > 0 && (
            <ProductVariantsScroll variants={otherVariants} />
          )}

          <div className="flex gap-x-4 items-center">
            <span className="text-3xl lg:text-4xl font-medium">
              {(selectedVariant.priceInCents / 100).toFixed(2)} €
            </span>
            <div className="flex items-center gap-x-1">
              <div
                className={cn("size-2 rounded-full", {
                  "bg-green-600": selectedVariant.stock > 5,
                  "bg-yellow-600":
                    selectedVariant.stock > 0 && selectedVariant.stock <= 5,
                  "bg-red-600": selectedVariant.stock === 0,
                })}
              />
              <span
                className={cn("text-sm", {
                  "text-green-600": selectedVariant.stock > 5,
                  "text-yellow-600":
                    selectedVariant.stock > 0 && selectedVariant.stock <= 5,
                  "text-red-600": selectedVariant.stock === 0,
                })}
              >
                {selectedVariant.stock > 5
                  ? "In Stock"
                  : selectedVariant.stock > 0 && selectedVariant.stock <= 5
                  ? "Limited Stock"
                  : "Out of Stock"}
              </span>
            </div>
          </div>

          <AddToCartButton productVariantId={selectedVariant.id} quantity={1}>
            {t("addToCartButton")}
          </AddToCartButton>
        </div>
      </div>
      {data.data.productBySlug.markdownContent && (
        <>
          <div className="h-0.5 w-full bg-accent my-4" />

          <div className="flex flex-col gap-y-4">
            <h3 className="text-2xl font-medium">
              {t("additionalInformation")}
            </h3>
            <div className="flex flex-wrap gap-x-4">
              {selectedVariant.attributes.map((attr) => (
                <div key={attr.key!.key} className="flex flex-col gap-y-0">
                  <span className="capitalize text-muted-foreground text-sm">
                    {attr.key!.key}
                  </span>
                  <span>{attr.value}</span>
                </div>
              ))}
            </div>
            <Markdown>{data.data.productBySlug.markdownContent}</Markdown>
          </div>
        </>
      )}
    </div>
  );
}
