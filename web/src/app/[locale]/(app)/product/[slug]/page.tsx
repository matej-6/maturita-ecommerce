"use server";

import { getProductPageData } from "@/app/data-access-layer/product.queries";
import { getImageSrc } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
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
  ];

  const variantName = selectedVariant.attributes
    .sort((a, b) => a.key!.key.localeCompare(b.key!.key))
    .map((attr) => attr.value)
    .join(", ");
  return (
    <div className="max-width-container bg-base/50 w-full mx-auto mt-8 gap-y-8 flex flex-col relative items-center">
      <div className="flex flex-col gap-y-1 ">
        <div className="w-72 h-72 flex items-center justify-center">
          {thumbnailImage ? (
            <img
              src={getImageSrc(thumbnailImage.mimeType, thumbnailImage.base64)}
              alt="Product variant image"
              className="size-full object-cover"
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
        {allImages.length > 0 && (
          <div className="w-72 overflow-x-auto gap-x-1 flex items-center justify-start">
            {allImages.map((image, index) => (
              <div key={index} className="w-16 h-16">
                <img
                  src={getImageSrc(image.mimeType, image.base64)}
                  alt={`Product image ${index + 1}`}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold text-center">
          {data.data.productBySlug.name ?? slug} {variantName}
        </h1>
      </div>
      <p className="text-secondary-foreground text-center">
        {data.data.productBySlug.description}
      </p>
      <div className="flex flex-col">
        <h2 className="text-2xl">
          {(selectedVariant.priceInCents / 100).toFixed(2)} €
        </h2>
        <Button size={"lg"}>Add to Cart</Button>
      </div>
      <div className="h-px w-full bg-accent-foreground" />
      {data.data.productBySlug.markdownContent && (
        <div className="flex flex-col gap-y-4">
          <h3 className="text-2xl">Additional Information</h3>
          <Markdown>{data.data.productBySlug.markdownContent}</Markdown>
        </div>
      )}
    </div>
  );
}
