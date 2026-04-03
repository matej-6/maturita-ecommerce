"use client";

import { getPagedProductReviewsById } from "@/app/data-access-layer/product.queries";
import { use } from "react";
import { PrevButton } from "./prev-button";
import { NextButton } from "./next-button";
import ProductReviewCard from "./product-review-card";

export default function ProductReviews({
  productReviewsPromise,
}: {
  productReviewsPromise: ReturnType<typeof getPagedProductReviewsById>;
}) {
  const data = use(productReviewsPromise);

  if (!data.success || !data.data?.paginatedProductReviewsByProductId) {
    return <p>Unable to load reviews...</p>;
  }

  const productReviews = data.data?.paginatedProductReviewsByProductId;

  const nextCursor = productReviews.nextCursor;

  return (
    <div className="flex flex-col gap-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {productReviews.edges?.map((reviewNode) => {
          const review = reviewNode.node;

          return (
            <ProductReviewCard
              key={review.id}
              className="w-full"
              review={{
                id: review.id,
                rating: review.rating,
                comment: review.comment ?? "",
                createdAt: new Date(review.createdAt),
                author: review.author
                  ? {
                      firstName: review.author.firstName,
                      lastName: review.author.lastName,
                      avatarUrl: review.author.avatarUrl || null,
                    }
                  : undefined,
                productVariant: review.productVariant
                  ? {
                      sku: review.productVariant.sku,
                    }
                  : undefined,
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-start gap-x-2">
        <PrevButton cursorKey="reviewsCursor" />
        <NextButton nextCursor={nextCursor} cursorKey="reviewsCursor" />
      </div>
    </div>
  );
}
