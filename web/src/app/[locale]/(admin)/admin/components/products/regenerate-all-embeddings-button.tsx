"use client";

import {
  regenerateAllProductEmbeddingsAction,
  regenerateProductContentEmeddingsAction,
} from "@/app/data-access-layer/admin/product/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  embeddingType: "embedding" | "contentEmbedding";
  disabled?: boolean;
};

export function RegenerateAllEmbeddingsButton({
  embeddingType,
  disabled = false,
}: Props) {
  const { mutate: generateEmbeddings, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      if (embeddingType === "embedding") {
        const res = await regenerateAllProductEmbeddingsAction();
        if (!res.success) {
          throw new Error(res.message || "Failed to regenerate embeddings");
        }
      } else if (embeddingType === "contentEmbedding") {
        const res = await regenerateProductContentEmeddingsAction();
        if (!res.success) {
          throw new Error(
            res.message || "Failed to regenerate content embeddings",
          );
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const t = useTranslations("admin.products.productDetail.page.embeddings");

  return (
    <ResponsiveButton
      onClick={() => generateEmbeddings()}
      disabled={isGenerating || disabled}
      variant={"secondary"}
    >
      {isGenerating ? t("generating") : t("regenerateAll")}
    </ResponsiveButton>
  );
}
