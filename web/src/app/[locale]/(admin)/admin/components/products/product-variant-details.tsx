"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SetImageThumbnailButton } from "./set-image-thumbnail-button";
import { DeleteImage } from "./delete-image-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductImageForm } from "../../forms/product-image-form";

type ProductVariant = {
  id: number;
  sku: string;
  priceInCents: number;
  stock: number;
  isPublic: boolean;
  attributes: { key: string; value: string }[];
  images: { id: number; src: string; alt: string; isThumbnail: boolean }[];
};

type Props = {
  productId: number;
  variants: ProductVariant[];
  attributeKeys: {
    key: string;
    keyId: number;
    attributes: {
      id: number;
      value: string;
    }[];
  }[];
};

export function ProductVariantsDetails({
  attributeKeys,
  productId,
  variants,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  return (
    <>
      {selectedVariant === null ? (
        <div className="flex flex-col gap-y-4">
          <h2 className="font-medium font-secondary">Variants</h2>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Button
                onClick={() => setSelectedVariant(variant)}
                key={variant.id}
                variant={"secondary"}
              >
                {variant.sku}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <Button
            className="w-fit"
            variant={"ghost"}
            size={"sm"}
            onClick={() => setSelectedVariant(null)}
          >
            Back
          </Button>
          <Card className="w-fit">
            <CardHeader>
              <CardTitle>{selectedVariant.sku} Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-4">
              <div className="grid grid-cols-3 gap-2 max-w-xl">
                <div className="flex flex-col gap-y-0">
                  <span className="font-medium text-xs text-muted-foreground">
                    Price
                  </span>
                  <span>
                    {(selectedVariant.priceInCents / 100).toFixed(2)}€
                  </span>
                </div>
                <div className="flex flex-col gap-y-0">
                  <span className="font-medium text-xs text-muted-foreground">
                    Stock
                  </span>
                  <span>{selectedVariant.stock}</span>
                </div>
                <div className="flex flex-col gap-y-0">
                  <span className="font-medium text-xs text-muted-foreground">
                    Is Public
                  </span>
                  <span>{selectedVariant.isPublic ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <h3 className="font-medium text-xs text-muted-foreground">
                  Attributes
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedVariant.attributes.map((attr) => (
                    <div
                      key={attr.key}
                      className="grid grid-cols-[3fr_3fr_1fr] items-center w-[200px]"
                    >
                      <span>{attr.key}</span>
                      <span>{attr.value}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Button
                              className="w-full justify-start"
                              variant={"ghost"}
                              size={"sm"}
                            >
                              Edit attribute
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Button
                              className="w-full justify-start"
                              variant={"ghost"}
                              size={"sm"}
                            >
                              Edit attribute key
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Button
                              className="w-full justify-start"
                              variant={"ghost"}
                              size={"sm"}
                            >
                              Remove attribute
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-y-4">
                <h3 className="font-medium text-xs text-muted-foreground">
                  Images
                </h3>
                {selectedVariant.images.length === 0 ? (
                  <span className="text-sm">No images uploaded.</span>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {selectedVariant.images.map((img) => (
                      <div
                        key={img.id}
                        className="w-48 h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center relative group"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
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
                                productId={productId}
                                productVariantId={selectedVariant.id}
                                imageId={img.id}
                              />
                            </div>
                          )}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <DeleteImage
                              productVariantId={selectedVariant.id}
                              productId={productId}
                              imageId={img.id}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <ProductImageForm
                  productVariantId={selectedVariant.id}
                  productId={productId}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
