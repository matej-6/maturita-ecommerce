"use server";

import Image from "next/image";
import EN_Banner1 from "@/public/images/en/homepage/banner1.svg";
import EN_Banner1Desktop from "@/public/images/en/homepage/banner1-desktop.svg";
import SK_Banner1 from "@/public/images/sk/homepage/banner1.svg";
import SK_Banner1Desktop from "@/public/images/sk/homepage/banner1-desktop.svg";
import { getHomepageData } from "@/app/data-access-layer/homepage.queries";
import { getImageSrc } from "@/app/lib/utils";
import { ProductsScroll } from "@/components/products-scroll";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("homePage");
  const locale = await getLocale();

  const data = await getHomepageData();

  const desktopBannerImage =
    locale === "sk" ? SK_Banner1Desktop : EN_Banner1Desktop;
  const bannerImage = locale === "sk" ? SK_Banner1 : EN_Banner1;

  const products = data.success ? data.data : null;

  const newArrivals = products?.searchProductVariants.edges || [];
  const bestSellers = products?.bestSellingProductVariantsStatistic || [];

  return (
    <div className="max-width-container my-6 sm:my-12 flex flex-col gap-y-6 sm:gap-y-12">
      <div>
        <Image
          src={bannerImage}
          className="w-full xs:hidden"
          alt="Banner 1"
          priority
        />
        <Image
          src={desktopBannerImage}
          className="w-full hidden xs:block"
          alt="Banner 1"
          priority
        />
      </div>
      <div className="flex flex-col gap-y-3 sm:gap-y-6">
        {newArrivals.length > 0 ? (
          <ProductsScroll
            header={t("newArrivals")}
            variants={newArrivals.map((productVariant) => {
              const variant = productVariant.node;
              const thumbnailImage =
                variant.thumbnailImage ??
                variant.product.thumbnailImage ??
                null;
              const variantName =
                variant.product.name +
                " " +
                variant.attributes
                  .map((a) => a.translatedValue || a.value)
                  .sort()
                  .join(" ");
              return {
                id: variant.id,
                name: variantName,
                description: variant.product.description ?? undefined,
                priceInCents: variant.priceInCents,
                productSlug: variant.product.slug,
                sku: variant.sku,
                imageUrl: thumbnailImage
                  ? getImageSrc(thumbnailImage.mimeType, thumbnailImage.base64)
                  : undefined,
              };
            })}
          />
        ) : (
          <p>{t("errorLoadingProducts")}</p>
        )}
        {bestSellers.length > 0 ? (
          <ProductsScroll
            header={t("bestSellers")}
            variants={bestSellers.map((statistic) => {
              const variant = statistic.productVariant;
              const thumbnailImage =
                variant.thumbnailImage ??
                variant.product.thumbnailImage ??
                null;
              const variantName =
                variant.product.name +
                " " +
                variant.attributes
                  .map((a) => a.translatedValue || a.value)
                  .sort()
                  .join(" ");
              return {
                id: variant.id,
                name: variantName,
                description: variant.product.description ?? undefined,
                priceInCents: variant.priceInCents,
                productSlug: variant.product.slug,
                sku: variant.sku,
                imageUrl: thumbnailImage
                  ? getImageSrc(thumbnailImage.mimeType, thumbnailImage.base64)
                  : undefined,
              };
            })}
          />
        ) : (
          <p>{t("errorLoadingProducts")}</p>
        )}
      </div>
    </div>
  );
}
