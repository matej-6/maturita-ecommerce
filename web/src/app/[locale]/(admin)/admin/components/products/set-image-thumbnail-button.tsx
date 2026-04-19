"use client";

import {
  setProductThumbnailImageAction,
  setVariantThumbnailImageAction,
} from "@/app/data-access-layer/admin/product/actions";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type Props = {
  productId: number;
  productVariantId?: number;
  imageId: number;
};

export function SetImageThumbnailButton({
  productId,
  productVariantId,
  imageId,
}: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (productVariantId !== undefined) {
        await setVariantThumbnailImageAction(
          productId,
          productVariantId,
          imageId,
        );
      } else {
        await setProductThumbnailImageAction(productId, imageId);
      }
    },
  });

  const t = useTranslations("admin.products.productDetail.page.images");

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate()}
      variant={"blackTransparent"}
      size={"xs"}
    >
      <span className="text-xs">
        {isPending ? t("settingAsThumbnailButton") : t("setAsThumbnailButton")}
      </span>
    </Button>
  );
}
