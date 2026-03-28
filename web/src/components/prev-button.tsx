"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export function PrevButton({
  disabled,
  children,
  cursor,
  cursorKey,
  ...variantProps
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    cursor?: string | number | null;
    cursorKey?: string;
  }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cursorValue =
    cursorKey !== undefined ? searchParams.get(cursorKey) : null;

  const pt = useTranslations("pagination");

  return (
    <Button
      onClick={() => {
        if (!disabled) {
          router.back();
        }
      }}
      {...variantProps}
      disabled={
        disabled ||
        cursor === null ||
        cursor === undefined ||
        cursorValue === null
      }
    >
      {children ?? (
        <>
          <ArrowLeftIcon className="size-3.5" />
          <span>{pt("previous")}</span>
        </>
      )}
    </Button>
  );
}
