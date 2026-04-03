import Image from "next/image";
import EN_Banner1 from "@/public/images/en/homepage/banner1.svg";
import EN_Banner1Desktop from "@/public/images/en/homepage/banner1-desktop.svg";
import SK_Banner1 from "@/public/images/sk/homepage/banner1.svg";
import SK_Banner1Desktop from "@/public/images/sk/homepage/banner1-desktop.svg";
import { getHomepageData } from "@/app/data-access-layer/homepage.queries";
import { getImageSrc } from "@/app/lib/utils";
import { ProductsScroll } from "@/components/products-scroll";
import { getLocale, getTranslations } from "next-intl/server";
import ProductReviewCard from "@/components/product-review-card";

export const revalidate = 300;

export default async function HomePage() {
  const t = await getTranslations("homePage");
  const locale = await getLocale();

  const data = await getHomepageData();

  const desktopBannerImage =
    locale === "sk" ? SK_Banner1Desktop : EN_Banner1Desktop;
  const bannerImage = locale === "sk" ? SK_Banner1 : EN_Banner1;

  const products = data.success ? data.data : null;

  const newArrivals = products?.searchProductVariants.edges || [];
  const bestSellers = products?.bestSellingProductVariantsStatistic || [];

  const reviews = products?.paginatedProductReviews.edges || [];

  const firstRowReviews = reviews.slice(0, 5);
  const secondRowReviews = reviews.slice(5);

  const reviewStyles = [
    "w-[380px] rotate-[-0.5deg]",
    "w-[300px] rotate-[-0.3deg]",
    "w-[320px] rotate-[0.2deg]",
    "w-[340px] rotate-[-0.5deg]",
    "w-[400px] rotate-[0.5deg]",
  ];

  return (
    <div className="max-width-container my-6 sm:my-12 flex flex-col gap-y-8 sm:gap-y-16">
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

      {newArrivals.length > 0 ? (
        <ProductsScroll
          header={t("newArrivals")}
          variants={newArrivals.map((productVariant) => {
            const variant = productVariant.node;
            const thumbnailImage =
              variant.thumbnailImage ?? variant.product.thumbnailImage ?? null;
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
              imageUrl: getImageSrc(thumbnailImage?.url),
            };
          })}
        />
      ) : (
        <p>{t("errorLoadingProducts")}</p>
      )}
      {firstRowReviews.length > 3 && (
        <div className="w-full flex flex-col gap-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {t("reviewsHeader")}
          </h2>
          <div className="w-full relative overflow-hidden flex flex-col gap-y-2">
            <div className="flex gap-4 overflow-x-auto disable-scrollbar animate-right py-2 px-1 w-fit">
              {[...firstRowReviews, ...firstRowReviews].map((review, i) => {
                return (
                  <ProductReviewCard
                    className={reviewStyles[i % reviewStyles.length]}
                    commentClassName="line-clamp-3"
                    key={i}
                    review={{
                      id: review.node.id,
                      rating: review.node.rating,
                      comment: review.node.comment ?? "",
                      createdAt: new Date(review.node.createdAt),
                      author: review.node.author
                        ? {
                            firstName: review.node.author.firstName,
                            lastName: review.node.author.lastName,
                            avatarUrl: review.node.author.avatarUrl || null,
                          }
                        : undefined,
                    }}
                  />
                );
              })}
            </div>
            <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent" />
          </div>
          {secondRowReviews.length > 3 && (
            <div className="w-full relative overflow-hidden flex flex-col gap-y-2">
              <div className="flex gap-4 overflow-x-auto disable-scrollbar animate-left py-2 px-1 w-fit">
                {[...secondRowReviews, ...secondRowReviews].map((review, i) => {
                  return (
                    <ProductReviewCard
                      className={
                        reviewStyles[(reviews.length - i) % reviewStyles.length]
                      }
                      commentClassName="line-clamp-3"
                      key={i}
                      review={{
                        id: review.node.id,
                        rating: review.node.rating,
                        comment: review.node.comment ?? "",
                        createdAt: new Date(review.node.createdAt),
                        author: review.node.author
                          ? {
                              firstName: review.node.author.firstName,
                              lastName: review.node.author.lastName,
                              avatarUrl: review.node.author.avatarUrl || null,
                            }
                          : undefined,
                      }}
                    />
                  );
                })}
              </div>
              <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent" />
              <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent" />
            </div>
          )}
        </div>
      )}
      {bestSellers.length > 0 ? (
        <ProductsScroll
          header={t("bestSellers")}
          variants={bestSellers.map((statistic) => {
            const variant = statistic.productVariant;
            const thumbnailImage =
              variant.thumbnailImage ?? variant.product.thumbnailImage ?? null;
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
              imageUrl: getImageSrc(thumbnailImage?.url),
            };
          })}
        />
      ) : (
        <p>{t("errorLoadingProducts")}</p>
      )}
    </div>
  );
}
