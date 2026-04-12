"use client";

import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "../account/avatar";
import { Card, CardContent } from "../ui/card";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductReviewCardProps = {
  className?: string;
  commentClassName?: string;
  review: {
    id: number;
    rating: number;
    comment: string;
    createdAt: Date;
    author?: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    productVariant?: {
      sku: string;
    };
    lang?: string;
  };
};

export default function ProductReviewCard({
  review,
  className,
  commentClassName,
}: ProductReviewCardProps) {
  const locale = useLocale();
  const t = useTranslations("review");

  return (
    <Card className={cn("p-0!", className)}>
      <CardContent className="flex flex-col gap-y-1 sm:gap-y-2 p-4! overflow-auto">
        <div className="flex items-center justify-start gap-x-1 sm:gap-x-2">
          <Avatar size="sm" imageSrc={review.author?.avatarUrl || undefined} />
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {review.author
              ? `${review.author.firstName} ${review.author.lastName.charAt(0)}.`
              : t("unknownUser")}
          </p>
          <div className="text-xs sm:text-sm font-light text-muted-foreground ml-auto flex items-center gap-x-1">
            {review.lang && <span>{review.lang}</span>}
            <span>{review.createdAt.toLocaleDateString(locale)}</span>
          </div>
        </div>
        {review.productVariant && (
          <div className="text-xs sm:text-sm text-muted-foreground">
            {t("variant")}: {review.productVariant.sku}
          </div>
        )}
        <div className="flex gap-x-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <StarIcon
              key={i}
              className="fill-amber-400 stroke-amber-400 size-3 sm:size-5"
            />
          ))}
        </div>
        <p
          className={cn(
            "text-sm sm:text-base text-muted-foreground",
            commentClassName,
          )}
        >
          {review.comment}
        </p>
      </CardContent>
    </Card>
  );
}
