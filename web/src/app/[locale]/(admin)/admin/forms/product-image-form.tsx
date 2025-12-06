"use client";

import {
  uploadProductImageAction,
  uploadVariantImageAction,
} from "@/app/data-access-layer/admin/product/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

type Props = {
  productId: number;
  productVariantId?: number;
};

export function ProductImageForm({ productId, productVariantId }: Props) {

  const { mutate: uploadProductImage, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result?.toString().split("base64,")[1];
        if (!base64String) return;
        const mimeType = file.type;

        if (productVariantId !== undefined) {
          await uploadVariantImageAction(
            productId,
            productVariantId,
            base64String,
            mimeType
          );
        } else {
          await uploadProductImageAction(productId, base64String, mimeType);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
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
        {isUploading ? "Uploading..." : "Upload Image"}
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
          await uploadProductImage(file);
        }}
      />
    </form>
  );
}
