import { getSearchProductsQueryData } from "@/app/data-access-layer/search.queries";
import { getImageSrc } from "@/app/lib/utils";
import { NextButton } from "@/components/next-button";
import { PrevButton } from "@/components/prev-button";
import { ProductFiltersSheet } from "@/components/product-filters-sheet";
import { ProductVariantCard } from "@/components/product-variant-card";
import { getTranslations } from "next-intl/server";

export const revalidate = 300;

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
  const t = await getTranslations("searchPage");

  const query = sp.q;
  if (typeof query !== "string" || query.trim() === "") {
    return (
      <div className="max-width-container w-full mx-auto mt-8">
        <div className="text-muted-foreground">{t("noResults")}</div>
      </div>
    );
  }

  const res = await getSearchProductsQueryData(
    query,
    cursor,
    pageSize,
    attributes,
  );

  if (!res.success) {
    return (
      <div className="max-width-container  w-full mx-auto my-8 gap-y-8">
        {t("errorFetchingResults")}
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
        (a) => a[0] === pva.key!.key && a[1] === pva.value,
      ),
    });
  });

  return (
    <div className="max-width-container w-full my-8 gap-y-8 flex flex-col">
      <h1 className="text-4xl font-bold">
        {t("title")} &quot;{query}&quot;
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
                return (
                  <ProductVariantCard
                    key={productVariant.id}
                    variant={{
                      ...productVariant,
                      name:
                        productVariant.product.name! +
                        " " +
                        productVariant.attributes
                          .map((a) => a.translatedValue || a.value)
                          .sort()
                          .join(" "),
                      productSlug: productVariant.product.slug,
                      imageUrl: getImageSrc(
                        productVariant.thumbnailImage?.url ??
                          productVariant.product.thumbnailImage?.url,
                      ),
                      description:
                        productVariant.product.description || undefined,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-start gap-x-2">
              <PrevButton cursor={cursor} className="items-center" />
              <NextButton nextCursor={productVariants.nextCursor ?? null} />
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">{t("noResults")}</div>
        )}
      </div>
    </div>
  );
}
