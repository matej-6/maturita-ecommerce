"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export function NextButton({
  disabled,
  children,
  nextCursor,
  cursorKey = "cursor",
  ...variantProps
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    nextCursor?: string | number | null;
    cursorKey?: string;
  }) {
  const router = useRouter();

  const pt = useTranslations("pagination");

  const sp = useSearchParams();
  const pathname = usePathname();

  const handleClick = () => {
    if (disabled || nextCursor === null) {
      return;
    }

    const params = new URLSearchParams(sp.toString());

    params.set(cursorKey, String(nextCursor));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Button
      onClick={() => {
        handleClick();
      }}
      variant={"outline"}
      {...variantProps}
      disabled={disabled || nextCursor == null}
    >
      {children ?? (
        <>
          <span>{pt("next")}</span>
          <ArrowRightIcon className="size-3.5" />
        </>
      )}
    </Button>
  );
}
