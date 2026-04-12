"use client";

import { deleteAttributeKeyAction } from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function DeleteAttributeKeyButton({ id }: { id: number }) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await deleteAttributeKeyAction(id);
      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push("/admin/attribute-keys");
    },
  });

  const t = useTranslations("admin.attributeKeys.page");

  return (
    <ResponsiveButton
      variant={"destructive"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {t("deleteButton")}
    </ResponsiveButton>
  );
}
