"use client";

import {
  generateProductEmbeddingAction,
  generateProdutContentEmbeddingAction,
} from "@/app/data-access-layer/admin/product/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  productId: number;
  lang: string;
  embeddingType: "embedding" | "contentEmbedding";
  type: "generate" | "regenerate";
};

export function GenerateEmbeddingsButton({
  productId,
  embeddingType,
  lang,
  type = "generate",
}: Props) {
  const { mutate: generateEmbeddings, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      if (embeddingType === "embedding") {
        const res = await generateProductEmbeddingAction(productId, lang);
        if (!res.success) {
          throw new Error(res.message || "Failed to generate embedding");
        }
      } else if (embeddingType === "contentEmbedding") {
        const res = await generateProdutContentEmbeddingAction(productId, lang);
        if (!res.success) {
          throw new Error(
            res.message || "Failed to generate content embedding"
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
      disabled={isGenerating}
      variant={type === "generate" ? "secondary" : "default"}
    >
      {isGenerating
        ? t("generating")
        : type === "generate"
        ? t("generate")
        : t("regenerate")}
    </ResponsiveButton>
  );
}
