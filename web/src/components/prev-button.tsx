"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrevButton({
  disabled,
  children,
  cursor,
  ...variantProps
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    cursor?: string | number | null;
  }) {
  const router = useRouter();

  const pt = useTranslations("pagination");

  return (
    <Button
      onClick={() => {
        if (!disabled) {
          router.back();
        }
      }}
      {...variantProps}
      disabled={disabled || cursor === null}
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
