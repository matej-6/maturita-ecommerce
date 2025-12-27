"use client";

import {
  regenerateAllProductEmbeddingsAction,
  regenerateProductContentEmeddingsAction,
} from "@/app/data-access-layer/admin/product/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  embeddingType: "embedding" | "contentEmbedding";
};

export function RegenerateAllEmbeddingsButton({ embeddingType }: Props) {
  const { mutate: generateEmbeddings, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      if (embeddingType === "embedding") {
        const res = await regenerateAllProductEmbeddingsAction();
        if (!res.success) {
          throw new Error(res.message || "Failed to regenerate embeddings...");
        }
      } else if (embeddingType === "contentEmbedding") {
        const res = await regenerateProductContentEmeddingsAction();
        if (!res.success) {
          throw new Error(
            res.message || "Failed to regenerate content embeddings..."
          );
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <ResponsiveButton
      onClick={() => generateEmbeddings()}
      disabled={isGenerating}
      variant="destructive"
    >
      {isGenerating ? "Generating..." : "Regenerate"}
    </ResponsiveButton>
  );
}
