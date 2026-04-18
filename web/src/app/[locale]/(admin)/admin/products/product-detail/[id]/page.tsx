"use server";

import { getProductDetailPageData } from "@/app/data-access-layer/admin/product/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Link } from "@/i18n/navigation";
import { AlertCircleIcon, ArrowUpRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductForm } from "../../../forms/product-sheet-form";
import { ProductTranslation } from "../../../components/products/product-translation";
import { ProductImageForm } from "../../../forms/product-image-form";
import { SetImageThumbnailButton } from "../../../components/products/set-image-thumbnail-button";
import { DeleteImage } from "../../../components/products/delete-image-button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductVariantSheetForm } from "../../../forms/product-variant-sheet-form";
import { GenerateEmbeddingsButton } from "../../../components/products/generate-embeddings-button";
import { RegenerateAllEmbeddingsButton } from "../../../components/products/regenerate-all-embeddings-button";
import { ProductTranslationSheetForm } from "../../../forms/product-translation-sheet-form";
import { getImageSrc } from "@/app/lib/utils";
import { ResponsiveButton } from "@/components/responsive-button";
import { DeleteProductButton } from "../../../components/products/delete-product-button";
import { Button } from "@/components/ui/button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return notFound();
  }

  const res = await getProductDetailPageData(parsedId);
  if (!res.success) {
    return <div>{res.message}</div>;
  }

  if (!res.data?.product) {
    return notFound();
  }

  const {
    product,
    categories,
    locales,
    productVariantAttributeKeys: attributeKeys,
  } = res.data;
  const missingTranslations = locales.filter(
    (l) => !product.translations.some((t) => t.locale === l.code),
  );

  const t = await getTranslations("admin.products.productDetail.page");
  const ft = await getTranslations("fields");

  return (
    <div className="flex flex-col gap-y-8 ">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          <h1 className="font-medium font-secondary">{t("title")}</h1>
          {!product.isSetup && (
            <Alert className="w-fit" variant={"destructive"}>
              <AlertCircleIcon />
              <AlertTitle>{t("setupWarning.title")}</AlertTitle>
              <AlertDescription>
                <p>{t("setupWarning.description")}</p>
                <ul className="list-inside list-disc text-sm">
                  <li>{t("setupWarning.englishTranslation")}</li>
                  <li>{t("setupWarning.atLeastOneVisibleVariant")}</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-wrap gap-x-24 gap-y-8 max-w-[1280px]">
            <div className="space-y-0 w-[300px]">
              <span className="text-muted-foreground text-xs">
                {ft("product.slug")}
              </span>
              <p>{product.slug}</p>
            </div>
            <div className="space-y-0 w-[300px]">
              <span className="text-muted-foreground text-xs">
                {ft("product.categoryId")}
              </span>
              <p>
                {product.categoryId ? (
                  <Link
                    href={`/admin/categories/edit-category/${product.categoryId}`}
                  >
                    {product.categoryId}
                  </Link>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
            <div className="space-y-0 w-[300px]">
              <span className="text-muted-foreground text-xs">
                {ft("product.isSetup")}
              </span>
              <p>{product.isSetup ? t("yes") : t("no")}</p>
            </div>
            <div className="space-y-0 w-[300px]">
              <span className="text-muted-foreground text-xs">
                {ft("product.isPublic")}
              </span>
              <p>{product.isPublic ? t("yes") : t("no")}</p>
            </div>
            <div className="space-y-0 w-[300px]">
              <span className="text-muted-foreground text-xs">
                {ft("product.createdAt")}
              </span>
              <p>{new Date(product.createdAt).toLocaleString()}</p>
            </div>
            <div className="space-y-0 w-[300px]">
              <span className="text-muted-foreground text-xs">
                {ft("product.updatedAt")}
              </span>
              <p>{new Date(product.updatedAt).toLocaleString()}</p>
            </div>
            <div className="space-y-0 w-[300px]">
              <span className="text-muted-foreground text-xs">
                {ft("product.numberOfVariants")}
              </span>
              <p>{product.variants.length}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start gap-x-4">
          <ProductForm
            categories={categories}
            productId={product.id}
            mode="edit"
            initialData={{
              slug: product.slug,
              categoryId: product.categoryId || null,
              isPublic: product.isPublic,
            }}
          />

          <Link href={`/product/${product.slug}`}>
            <Button className="group gap-x-0.5" variant={"link"}>
              <span>{t("viewPageButton")}</span>
              <ArrowUpRightIcon className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-100" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium font-secondary">{t("images.title")}</h2>
        {product.images.length === 0 ? (
          <span>{t("images.noImages")}</span>
        ) : (
          <div className="flex flex-wrap gap-4">
            {product.images.map((img) => (
              <div
                key={img.id}
                className="w-48 h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center relative group"
              >
                <img
                  src={getImageSrc(img.url) ?? ""}
                  alt={product.slug}
                  className="object-cover w-full h-full"
                  width={200}
                  height={200}
                />
                <div className="absolute top-2 left-2 flex gap-x-1 justify-start items-end">
                  {img.isThumbnail ? (
                    <span className=" bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                      {t("images.thumbnailLabel")}
                    </span>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <SetImageThumbnailButton
                        productId={product.id}
                        imageId={img.id}
                      />
                    </div>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteImage productId={product.id} imageId={img.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <ProductImageForm productId={product.id} />
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium font-secondary">
          {t("translations.title")}
        </h2>
        <div className="flex flex-wrap gap-8">
          {product.translations.map((t) => {
            const locale = locales.find((l) => l.code === t.locale);
            if (!locale) return null;

            const availableLocales = [locale, ...missingTranslations];

            return (
              <ProductTranslation
                key={t.id}
                formProps={{
                  availableLocales: availableLocales.map((l) => ({
                    label: l.name,
                    value: l.code,
                  })),
                  mode: "edit",
                  productId: product.id,
                  translationId: t.id,
                  initialData: {
                    locale: t.locale,
                    markdownContent: t.markdownContent || "",
                    name: t.name,
                    description: t.description || "",
                  },
                }}
                locale={locale}
                name={t.name}
                description={t.description || ""}
                translationId={t.id}
                productId={product.id}
              />
            );
          })}
        </div>
        <div>
          <ProductTranslationSheetForm
            productId={product.id}
            mode="create"
            availableLocales={missingTranslations.map((t) => ({
              label: t.name,
              value: t.code,
            }))}
          />
        </div>
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium font-secondary">{t("variants.title")}</h2>

        <div className="flex flex-wrap gap-8">
          {product.variants.map((variant) => {
            return (
              <Card key={variant.id} className="w-lg">
                <CardHeader>
                  <CardTitle>{variant.sku}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-4">
                  <div className="grid grid-cols-3 gap-2 max-w-xl">
                    <div className="flex flex-col gap-y-0">
                      <span className="font-medium text-xs text-muted-foreground">
                        {ft("productVariant.price")}
                      </span>
                      <span>{(variant.priceInCents / 100).toFixed(2)}€</span>
                    </div>
                    <div className="flex flex-col gap-y-0">
                      <span className="font-medium text-xs text-muted-foreground">
                        {ft("productVariant.stock")}
                      </span>
                      <span>{variant.stock}</span>
                    </div>
                    <div className="flex flex-col gap-y-0">
                      <span className="font-medium text-xs text-muted-foreground">
                        {ft("productVariant.isPublic")}
                      </span>
                      <span>
                        {variant.isPublic ? ft("common.yes") : ft("common.no")}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium text-xs text-muted-foreground">
                      {t("variants.attributes.title")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variant.attributes.length === 0 ? (
                        <span>{t("variants.attributes.noAttributes")}</span>
                      ) : (
                        variant.attributes.map((attr) => (
                          <Link
                            key={attr.id}
                            href={`/admin/attribute-keys/key-detail/${attr.key?.id}`}
                          >
                            <ResponsiveButton variant={"link"} size={"sm"}>
                              {attr.key?.key} {attr.value}{" "}
                              <ArrowUpRightIcon className="size-3.5 ml-1" />
                            </ResponsiveButton>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-4">
                    <h3 className="font-medium text-xs text-muted-foreground">
                      {t("variants.images.title")}
                    </h3>
                    {variant.images.length === 0 ? (
                      <span className="text-sm">
                        {t("variants.images.noImages")}
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {variant.images.map((img) => (
                          <div
                            key={img.id}
                            className="w-48 h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center relative group"
                          >
                            <img
                              src={getImageSrc(img.url) ?? ""}
                              alt={variant.sku}
                              className="object-cover w-full h-full"
                              width={200}
                              height={200}
                            />
                            <div className="absolute top-2 left-2 flex gap-x-1 justify-start items-end">
                              {img.isThumbnail ? (
                                <span className=" bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                  {t("variants.images.thumbnailLabel")}
                                </span>
                              ) : (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <SetImageThumbnailButton
                                    productId={product.id}
                                    productVariantId={variant.id}
                                    imageId={img.id}
                                  />
                                </div>
                              )}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <DeleteImage
                                  productVariantId={variant.id}
                                  productId={product.id}
                                  imageId={img.id}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <ProductImageForm
                      productVariantId={variant.id}
                      productId={product.id}
                    />

                    <ProductVariantSheetForm
                      buttonVariant="secondary"
                      mode="edit"
                      productId={product.id}
                      productVariantId={variant.id}
                      initialData={{
                        ...variant,
                        attributes: variant.attributes.map((a) => a.id),
                      }}
                      allAttributes={attributeKeys.reduce(
                        (acc, val) => {
                          val.attributes.forEach((a) =>
                            acc.push({
                              id: a.id,
                              key: val.key,
                              keyId: val.id,
                              value: a.value,
                            }),
                          );
                          return acc;
                        },
                        [] as {
                          id: number;
                          key: string;
                          keyId: number;
                          value: string;
                        }[],
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="flex items-center justify-start gap-x-2">
          <ProductVariantSheetForm
            mode="create"
            productId={product.id}
            allAttributes={attributeKeys.reduce(
              (acc, val) => {
                val.attributes.forEach((a) =>
                  acc.push({
                    id: a.id,
                    key: val.key,
                    keyId: val.id,
                    value: a.value,
                  }),
                );
                return acc;
              },
              [] as {
                id: number;
                key: string;
                keyId: number;
                value: string;
              }[],
            )}
          />
        </div>
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium">{t("embeddings.title")}</h2>
        <div>
          <RegenerateAllEmbeddingsButton
            disabled={product.embeddings.length === 0}
            embeddingType="embedding"
          />
        </div>
        <div className="flex flex-wrap gap-8">
          {product.embeddings.map((embedding) => {
            const { flag, name } =
              locales.find((l) => l.code === embedding.lang) || {};

            return (
              <Card
                key={embedding.id}
                className="p-2 sm:p-4 w-[400px] flex flex-col gap-y-4"
              >
                <div className="flex flex-col gap-y-4">
                  <div>
                    {flag}{" "}
                    <span className="text-sm text-muted-foreground">
                      ({name || embedding.lang})
                    </span>
                  </div>
                  <div className="flex gap-x-4 items-center">
                    <div className="-space-y-1">
                      <span className="text-muted-foreground text-xs">
                        {t("embeddings.createdAt")}
                      </span>
                      <div>
                        {
                          new Date(embedding.createdAt)
                            .toLocaleString()
                            .split(",")[0]
                        }
                      </div>
                    </div>
                    <div className="-space-y-1">
                      <span className="text-muted-foreground text-xs">
                        {t("embeddings.status")}
                      </span>
                      <div>{embedding.status}</div>
                    </div>
                  </div>
                </div>
                <GenerateEmbeddingsButton
                  productId={product.id}
                  lang={embedding.lang}
                  type="regenerate"
                  embeddingType="embedding"
                />
              </Card>
            );
          })}
          {product.missingEmbeddingLanguages.map((lang) => (
            <Card
              key={lang}
              className="p-2 sm:p-4 w-[400px] flex flex-col gap-y-4"
            >
              <div className="text-lg font-semibold">{lang}</div>
              <div>{t("embeddings.noEmbeddings")}</div>
              <GenerateEmbeddingsButton
                productId={product.id}
                lang={lang}
                type="generate"
                embeddingType="embedding"
              />
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium">{t("contentEmbeddings.title")}</h2>
        <div>
          <RegenerateAllEmbeddingsButton
            disabled={product.contentEmbeddings.length === 0}
            embeddingType="contentEmbedding"
          />
        </div>
        <div className="flex flex-wrap gap-8">
          {product.contentEmbeddings.map((embedding) => {
            const { flag, name } =
              locales.find((l) => l.code === embedding.lang) || {};

            return (
              <Card
                key={embedding.id}
                className="p-2 sm:p-4 w-[400px] flex flex-col gap-y-4"
              >
                <div className="flex flex-col gap-y-4">
                  <div>
                    {flag}{" "}
                    <span className="text-sm text-muted-foreground">
                      ({name || embedding.lang})
                    </span>
                  </div>
                  <div className="flex gap-x-4 items-center">
                    <div className="-space-y-1">
                      <span className="text-muted-foreground text-xs">
                        {t("contentEmbeddings.createdAt")}
                      </span>
                      <div>
                        {
                          new Date(embedding.createdAt)
                            .toLocaleString()
                            .split(",")[0]
                        }
                      </div>
                    </div>
                    <div className="-space-y-1">
                      <span className="text-muted-foreground text-xs">
                        {t("contentEmbeddings.status")}
                      </span>
                      <div>{embedding.status}</div>
                    </div>
                  </div>
                </div>
                <GenerateEmbeddingsButton
                  productId={product.id}
                  lang={embedding.lang}
                  type="regenerate"
                  embeddingType="contentEmbedding"
                />
              </Card>
            );
          })}
          {product.missingContentEmbeddingLanguages.map((lang) => (
            <Card
              key={lang}
              className="p-2 sm:p-4 w-[400px] flex flex-col gap-y-4"
            >
              <div className="text-lg font-semibold">{lang}</div>
              <div>{t("contentEmbeddings.noEmbeddings")}</div>
              <GenerateEmbeddingsButton
                productId={product.id}
                lang={lang}
                type="generate"
                embeddingType="contentEmbedding"
              />
            </Card>
          ))}
        </div>
      </div>
      <div className="h-px w-full bg-accent rounded-full" />
      <div>
        <DeleteProductButton productId={parsedId} />
      </div>
    </div>
  );
}
