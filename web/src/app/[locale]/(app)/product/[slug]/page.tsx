"use server";

import { getProductPageData } from "@/app/data-access-layer/product.queries";
import { getImageSrc } from "@/app/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImages } from "@/components/product-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link, redirect } from "@/i18n/navigation";
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

  const variantName = selectedVariant.attributes
    .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
    .map((attr) => attr.value)
    .join(", ");
  return (
    <div className="max-width-container bg-base/50 w-full mx-auto mt-8 gap-y-8 flex flex-col relative items-center">
      <div className="flex flex-col gap-y-8 items-start">
        <div className="flex flex-col md:flex-row gap-y-8 items-start w-full gap-x-8 ">
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
          <div className="flex flex-col gap-y-4 flex-1  md:mt-4">
            <h1 className="text-2xl lg:text-4xl font-bold">
              {data.data.productBySlug.name ?? slug} {variantName}
            </h1>
            <p className="text-secondary-foreground lg:text-lg">
              {data.data.productBySlug.description}
            </p>
            <div className="hidden lg:grid grid-cols-2 gap-y-2 gap-x-4">
              {selectedVariant.attributes.map((attr) => (
                <div key={attr.key!.key}>
                  <span className="capitalize text-accent-foreground mr-1">
                    {attr.key!.key}
                  </span>
                  <span className="font-medium text-accent-foreground">
                    {attr.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-y-4 md:mt-8">
              <h2 className="text-3xl font-semibold">
                {(selectedVariant.priceInCents / 100).toFixed(2)} €
              </h2>
              <AddToCartButton
                productVariantId={selectedVariant.id}
                quantity={1}
              >
                {t("addToCartButton")}
              </AddToCartButton>
            </div>
          </div>
        </div>
        {data.data.productBySlug.variants.length > 1 && (
          <>
            <div className="h-px w-full bg-accent-foreground" />

            <div className="flex flex-col gap-y-4">
              <h3 className="text-2xl">{t("moreVariants")}</h3>
              <div className="flex gap-4 max-w-full overflow-x-scroll">
                {data.data.productBySlug.variants
                  .filter((v) => v.sku !== selectedVariant.sku)
                  .map((variant) => {
                    const variantName = variant.attributes
                      .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
                      .map((attr) => attr.value)
                      .join(", ");
                    const variantThumbnailImage =
                      variant.images.find((i) => i.isThumbnail) ||
                      thumbnailImage;
                    return (
                      <Link
                        href={`/product/${slug}?variant=${variant.sku}`}
                        key={variant.sku}
                      >
                        <Card className="w-[200px]">
                          <CardHeader>
                            <div className="size-full">
                              {variantThumbnailImage ? (
                                <img
                                  src={getImageSrc(
                                    variantThumbnailImage.mimeType,
                                    variantThumbnailImage.base64
                                  )}
                                  alt="Variant image"
                                  className="size-full object-cover"
                                />
                              ) : (
                                <p>{t("noImageAvailable")}</p>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col gap-y-2">
                              <h4 className="text-lg font-medium">
                                {data.data!.productBySlug?.name || slug}{" "}
                                {variantName}
                              </h4>
                              <p className="text-secondary-foreground">
                                {(variant.priceInCents / 100).toFixed(2)} €
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </>
        )}
        <div className="h-px w-full bg-accent-foreground" />
        {data.data.productBySlug.markdownContent && (
          <div className="flex flex-col gap-y-4">
            <h3 className="text-2xl">{t("additionalInformation")}</h3>
            <Markdown>{data.data.productBySlug.markdownContent}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
