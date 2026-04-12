"use client";

import { deleteProductAction } from "@/app/data-access-layer/admin/product/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  productId: number;
};

export function DeleteProductButton({ productId }: Props) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteProductAction(productId);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.replace("/admin/products");
    },
  });

  const t = useTranslations("admin.products.productDetail.page");

  return (
    <ResponsiveButton
      disabled={isPending}
      onClick={() => mutate()}
      variant={"destructive"}
    >
      {t("deleteButton")}
    </ResponsiveButton>
  );
}
