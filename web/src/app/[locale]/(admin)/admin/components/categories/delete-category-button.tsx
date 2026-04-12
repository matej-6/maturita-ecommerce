"use client";

import { deleteCategoryAction } from "@/app/data-access-layer/admin/category/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  categoryId: number;
};

export function DeleteCategoryButton({ categoryId }: Props) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteCategoryAction(categoryId);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.replace("/admin/categories");
    },
  });

  const t = useTranslations("admin.categories.editCategory.page");

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
