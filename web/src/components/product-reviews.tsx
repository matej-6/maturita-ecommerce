"use client";

import { getPagedProductReviewsById } from "@/app/data-access-layer/product.queries";
import { Card, CardContent } from "./ui/card";
import { Avatar } from "./avatar";
import { StarIcon } from "lucide-react";
import { use } from "react";
import { PrevButton } from "./prev-button";
import { NextButton } from "./next-button";
import { getImageSrc } from "@/app/lib/utils";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {productReviews.edges?.map((reviewNode) => {
          const review = reviewNode.node;

          return (
            <Card className="w-full" key={review.id}>
              <CardContent className="flex flex-col gap-y-4">
                <div className="flex items-center justify-start gap-x-2">
                  <Avatar
                    size="sm"
                    imageSrc={review.author?.avatarUrl || undefined}
                    session={null}
                  />
                  <p className="text-muted-foreground">
                    {review.author
                      ? `${review.author.firstName} ${review.author.lastName}`
                      : "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground ml-auto">
                    {new Date(review.createdAt).toLocaleDateString("sk")}
                  </p>
                </div>
                <div>
                  <p>
                    Variant{" "}
                    <span className="font-medium">
                      {review.productVariant?.sku || "Unknown"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-x-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="fill-amber-300 stroke-amber-300 size-6"
                    />
                  ))}
                </div>
                <p className="text-lg text-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-start gap-x-2">
        <PrevButton cursorKey="reviewsCursor" />
        <NextButton nextCursor={nextCursor} />
      </div>
    </div>
  );
}
