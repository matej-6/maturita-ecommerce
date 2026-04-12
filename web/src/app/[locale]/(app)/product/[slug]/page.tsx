"use server";

import { getProductPageData } from "@/app/data-access-layer/product/actions";
import { getPagedProductReviewsById } from "@/app/data-access-layer/product/actions";
import { getImageSrc } from "@/app/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImages } from "@/components/products/product-images";
import { ProductVariantsScroll } from "@/components/products/product-variants-scroll";
import { redirect } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

const ProductReviews = dynamic(
  () => import("@/components/products/product-reviews"),
  {
    loading: () => {
      return (
        <div className="w-full py-10 flex items-center justify-center">
          <span className="text-muted-foreground">Loading reviews...</span>
        </div>
      );
    },
  },
);

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
    data.data.productBySlug.variants.length === 0 ||
    data.data.productBySlug.isPublic === false
  ) {
    return notFound();
  }

  const locale = await getLocale();

  const t = await getTranslations("productPage");
  const ft = await getTranslations("fields");

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
    (v) => v.sku === variant,
  );
  if (!selectedVariant || selectedVariant.isPublic === false) {
    return notFound();
  }

  const productThumbnailImage = data.data.productBySlug.images.find(
    (i) => i.isThumbnail,
  );
  const thumbnailImage =
    selectedVariant.images.find((i) => i.isThumbnail) || productThumbnailImage;

  const allImages = [
    ...selectedVariant.images,
    ...data.data.productBySlug.images,
  ].map((image) => ({
    url: getImageSrc(image.url) ?? "`",
    altText: data.data!.productBySlug?.name || slug,
    id: image.id,
  }));

  const otherVariants = data.data.productBySlug.variants
    .filter((v) => v.sku !== selectedVariant.sku && v.isPublic !== false)
    .map((v) => {
      const variantName = v.attributes
        .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
        .map((attr) => attr.value)
        .join(", ");

      const thumbnail =
        v.images.find((i) => i.isThumbnail) || productThumbnailImage;
      return {
        id: v.id,
        productSlug: slug,
        sku: v.sku,
        name: (data.data?.productBySlug?.name ?? slug) + " " + variantName,
        priceInCents: v.priceInCents,
        imageUrl: thumbnail ? getImageSrc(thumbnail.url) : undefined,
      };
    });

  const variantName = selectedVariant.attributes
    .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
    .map((attr) => attr.value)
    .join(", ");

  const reviewsCursor = sp.reviewsCursor
    ? parseInt(sp.reviewsCursor as string, 10)
    : null;

  const reviewsPromise = getPagedProductReviewsById(
    data.data.productBySlug.id,
    reviewsCursor,
    10,
  );
  return (
    <div className="max-width-container w-full mx-auto my-6 sm:my-12 gap-y-6 sm:gap-y-12 flex flex-col relative items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-y-5 sm:gap-y-8 gap-x-8">
        <ProductImages
          images={allImages}
          thumbnailImage={
            thumbnailImage
              ? {
                  url: getImageSrc(thumbnailImage.url) ?? "",
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
              <h2 className="text-accent-foreground text-sm">
                {ft("productTranslation.description")}
              </h2>
              <p className="text-accent-foreground text-base">
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
                  ? t("stock.inStock")
                  : selectedVariant.stock > 0 && selectedVariant.stock <= 5
                    ? t("stock.limitedStock")
                    : t("stock.outOfStock")}
              </span>
            </div>
          </div>

          <AddToCartButton
            buttonProps={{ size: "lg", variant: "default" }}
            productVariantId={selectedVariant.id}
            quantity={1}
            className="text-base"
          >
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
                    {attr.key!.translatedKey ?? attr.key!.key}
                  </span>
                  <span>{attr.value}</span>
                </div>
              ))}
            </div>
            <Markdown>{data.data.productBySlug.markdownContent}</Markdown>
          </div>
        </>
      )}
      <div className="h-0.5 w-full bg-accent my-4" />
      <div className="flex flex-col gap-y-4 w-full">
        <h3 className="text-2xl font-medium">{t("reviewsTitle")}</h3>
        <ProductReviews productReviewsPromise={reviewsPromise} />
      </div>
    </div>
  );
}
