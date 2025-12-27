"use server";

import { getProductDetailPageData } from "@/app/data-access-layer/admin/product/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { AlertCircleIcon, ArrowUpRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductForm } from "../../../forms/product-form";
import { ProductTranslation } from "../../../components/products/product-translation";
import { AddProductTranslationSheet } from "../../../components/products/add-product-translation-sheet";
import { getImageSrc } from "@/app/lib/utils";
import Image from "next/image";
import { ProductImageForm } from "../../../forms/product-image-form";
import { SetImageThumbnailButton } from "../../../components/products/set-image-thumbnail-button";
import { DeleteImage } from "../../../components/products/delete-image-button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttributeKeyForm } from "../../../forms/attribute-key-form";
import { AttributeForm } from "../../../forms/attribute-form";
import { ProductVariantForm } from "../../../forms/product-variant-form";
import { GenerateEmbeddingsButton } from "../../../components/products/generate-embeddings-button";
import { RegenerateAllEmbeddingsButton } from "../../../components/products/regenerate-all-embeddings-button";

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

  const locale = await getLocale();

  const revalidatePathUrls = [
    `/${locale}/admin/products/product-detail/${id}`,
    `/${locale}/admin/products`,
  ];

  const {
    product,
    categories,
    locales,
    productVariantAttributeKeys: attributeKeys,
  } = res.data;
  const missingTranslations = locales.filter(
    (l) => !product.translations.some((t) => t.locale === l.code)
  );

  const t = await getTranslations("admin.products.productDetail.page");

  return (
    <div className="bg-muted/25 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6 gap-y-8 ">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          <h1 className="font-medium font-secondary">Overview</h1>
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
          <div className="grid grid-cols-3 gap-6 w-3xl">
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Slug</span>
              <p>{product.slug}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Category ID</span>
              <p>
                {product.categoryId ? (
                  <Link
                    href={`/admin/categories/edit-category/${product.categoryId}`}
                  >
                    {product.categoryId}
                  </Link>
                ) : (
                  "None"
                )}
              </p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Is Setup</span>
              <p>{product.isSetup ? "Yes" : "No"}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Is Public</span>
              <p>{product.isPublic ? "Yes" : "No"}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Created At</span>
              <p>{new Date(product.createdAt).toLocaleString()}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">Updated At</span>
              <p>{new Date(product.updatedAt).toLocaleString()}</p>
            </div>
            <div className="space-y-0">
              <span className="text-muted-foreground text-xs">
                Nu. of variants
              </span>
              <p>{product.variants.length}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start gap-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-fit">Edit</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit product</SheetTitle>
                <SheetDescription>
                  Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4">
                  <ProductForm
                    categories={categories}
                    mode="edit"
                    initialData={{
                      slug: product.slug,
                      categoryId: product.categoryId || null,
                      isPublic: product.isPublic,
                    }}
                    revalidatePaths={revalidatePathUrls}
                  />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
          <Link href={`/product/${product.slug}`}>
            <Button className="group gap-x-0.5" variant={"link"}>
              <span>View page</span>
              <ArrowUpRightIcon className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-100" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium font-secondary">Images</h2>
        {product.images.length === 0 ? (
          <span>No images uploaded.</span>
        ) : (
          <div className="flex flex-wrap gap-4">
            {product.images.map((img) => (
              <div
                key={img.id}
                className="w-48 h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center relative group"
              >
                <Image
                  src={getImageSrc(img.mimeType, img.base64)}
                  alt={product.slug}
                  className="object-cover w-full h-full"
                  width={200}
                  height={200}
                />
                <div className="absolute top-2 left-2 flex gap-x-1 justify-start items-end">
                  {img.isThumbnail ? (
                    <span className=" bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                      Thumbnail
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
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium font-secondary">Translations</h2>
        <div className="flex gap-8">
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
        <AddProductTranslationSheet
          id={product.id}
          availableLocales={missingTranslations.map((t) => ({
            label: t.name,
            value: t.code,
          }))}
        />
      </div>
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium font-secondary">Variants</h2>

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
                        Price
                      </span>
                      <span>{(variant.priceInCents / 100).toFixed(2)}€</span>
                    </div>
                    <div className="flex flex-col gap-y-0">
                      <span className="font-medium text-xs text-muted-foreground">
                        Stock
                      </span>
                      <span>{variant.stock}</span>
                    </div>
                    <div className="flex flex-col gap-y-0">
                      <span className="font-medium text-xs text-muted-foreground">
                        Is Public
                      </span>
                      <span>{variant.isPublic ? "Yes" : "No"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium text-xs text-muted-foreground">
                      Attributes
                    </h3>
                    <div className="">
                      {variant.attributes.length === 0 ? (
                        <span>No attributes.</span>
                      ) : (
                        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] justify-start items-center w-full">
                          <span className="font-medium text-xs text-muted-foreground">
                            Key
                          </span>
                          <span className="font-medium text-xs text-muted-foreground ">
                            Value
                          </span>
                          <span className="col-span-3 font-medium text-xs text-muted-foreground">
                            Actions
                          </span>
                        </div>
                      )}
                      {variant.attributes.map((attr) => (
                        <div
                          key={attr.id}
                          className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center w-full justify-start"
                        >
                          <span>{attr.key?.key}</span>
                          <span>{attr.value}</span>
                          <Link href={`/admin/attribute-keys/${attr.key?.id}`}>
                            <Button variant={"link"} size={"sm"}>
                              Details
                            </Button>
                          </Link>
                          {/* <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                disabled={!attr.key}
                                variant={"ghost"}
                                size={"sm"}
                              >
                                Edit key
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Edit Attribute Key</SheetTitle>
                              </SheetHeader>
                              <div className="grow flex flex-col">
                                <div className="flex-1 px-4">
                                  <AttributeKeyForm
                                    mode="edit"
                                    productId={product.id}
                                    keyId={attr.key!.id}
                                    initialData={{
                                      key: attr.key?.key || "",
                                    }}
                                  />
                                </div>
                                <SheetFooter>
                                  <SheetClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </SheetClose>
                                </SheetFooter>
                              </div>
                            </SheetContent>
                          </Sheet> */}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-4">
                    <h3 className="font-medium text-xs text-muted-foreground">
                      Images
                    </h3>
                    {variant.images.length === 0 ? (
                      <span className="text-sm">No images uploaded.</span>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {variant.images.map((img) => (
                          <div
                            key={img.id}
                            className="w-48 h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center relative group"
                          >
                            <Image
                              src={getImageSrc(img.mimeType, img.base64)}
                              alt={variant.sku}
                              className="object-cover w-full h-full"
                              width={200}
                              height={200}
                            />
                            <div className="absolute top-2 left-2 flex gap-x-1 justify-start items-end">
                              {img.isThumbnail ? (
                                <span className=" bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                                  Thumbnail
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
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="w-fit">Edit</Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit variant</SheetTitle>
                        </SheetHeader>
                        <div className="grow flex flex-col">
                          <div className="flex-1 px-4">
                            <ProductVariantForm
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
                                    })
                                  );
                                  return acc;
                                },
                                [] as {
                                  id: number;
                                  key: string;
                                  keyId: number;
                                  value: string;
                                }[]
                              )}
                            />
                          </div>
                          <SheetFooter>
                            <SheetClose asChild>
                              <Button variant="outline">Close</Button>
                            </SheetClose>
                          </SheetFooter>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="flex items-center justify-start gap-x-2">
          <Button className="w-fit">Add Variant</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-fit" variant={"secondary"}>
                New Attribute Key
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Attribute Key</SheetTitle>
              </SheetHeader>
              <div className="grow flex flex-col">
                <div className="flex-1 px-4">
                  <AttributeKeyForm mode="create" productId={product.id} />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-fit" variant={"secondary"}>
                New Attribute
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Attribute</SheetTitle>
              </SheetHeader>
              <div className="grow flex flex-col">
                <div className="flex-1 px-4">
                  <AttributeForm
                    mode="create"
                    productId={product.id}
                    availableKeys={attributeKeys.map((k) => ({
                      id: k.id,
                      key: k.key,
                    }))}
                  />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium">Embeddings</h2>
        <RegenerateAllEmbeddingsButton embeddingType="embedding" />
        <div className="flex flex-wrap gap-8">
          {product.embeddings.map((embedding) => (
            <Card key={embedding.id} className="p-2! w-[196px]">
              <div className="text-lg font-semibold">{embedding.lang}</div>
              <div className="flex flex-wrap">
                <div className="-space-y-1">
                  <span className="text-muted-foreground font-bold text-sm">
                    Created At
                  </span>
                  <div>{new Date(embedding.createdAt).toLocaleString()}</div>
                </div>
                <div className="-space-y-1">
                  <span className="text-muted-foreground font-bold text-sm">
                    Status
                  </span>
                  <div>{embedding.status}</div>
                </div>
              </div>
              <GenerateEmbeddingsButton
                productId={product.id}
                lang={embedding.lang}
                type="regenerate"
                embeddingType="embedding"
              />
            </Card>
          ))}
          {product.missingEmbeddingLanguages.map((lang) => (
            <Card key={lang} className="p-2! w-[196px]">
              <div className="text-lg font-semibold">{lang}</div>
              <div>No embedding generated yet.</div>
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
        <h2 className="font-medium">Content Embeddings</h2>
        <RegenerateAllEmbeddingsButton embeddingType="contentEmbedding" />
        <div className="flex flex-wrap gap-8">
          {product.contentEmbeddings.map((embedding) => (
            <Card key={embedding.id} className="p-2! w-[196px]">
              <div className="text-lg font-semibold">{embedding.lang}</div>
              <div className="flex flex-wrap">
                <div className="-space-y-1">
                  <span className="text-muted-foreground font-bold text-sm">
                    Created At
                  </span>
                  <div>{new Date(embedding.createdAt).toLocaleString()}</div>
                </div>
                <div className="-space-y-1">
                  <span className="text-muted-foreground font-bold text-sm">
                    Status
                  </span>
                  <div>{embedding.status}</div>
                </div>
              </div>
              <GenerateEmbeddingsButton
                productId={product.id}
                lang={embedding.lang}
                type="regenerate"
                embeddingType="contentEmbedding"
              />
            </Card>
          ))}
        </div>
        {product.missingContentEmbeddingLanguages.map((lang) => (
          <Card key={lang} className="p-2! w-[196px]">
            <div className="text-lg font-semibold">{lang}</div>
            <div>No embedding generated yet.</div>
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
  );
}
