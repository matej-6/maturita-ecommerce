"use client";

import {
  uploadProductImageAction,
  uploadVariantImageAction,
} from "@/app/data-access-layer/admin/product/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type Props = {
  productId: number;
  productVariantId?: number;
};

export function ProductImageForm({ productId, productVariantId }: Props) {
  const t = useTranslations("admin.products.productDetail.page.images");

  const { mutate: uploadProductImage, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      if (productVariantId !== undefined) {
        await uploadVariantImageAction(productId, productVariantId, formData);
      } else {
        await uploadProductImageAction(productId, formData);
      }
    },
  });

  return (
    <form>
      <label
        htmlFor={
          `productImage-${productId}` + productVariantId
            ? `-variant-${productVariantId}`
            : ""
        }
        className={cn(buttonVariants())}
      >
        {isUploading ? t("uploadingButton") : t("uploadImageButton")}
      </label>
      <input
        id={
          `productImage-${productId}` + productVariantId
            ? `-variant-${productVariantId}`
            : ""
        }
        type="file"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={async (e) => {
          if (isUploading) return;
          const file = e.target.files?.[0];
          if (!file) {
            return;
          }
          uploadProductImage(file);
        }}
      />
    </form>
  );
}
