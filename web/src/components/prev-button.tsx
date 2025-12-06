"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeftIcon } from "lucide-react";

export function PrevButton({
  disabled,
  children,
  ...variantProps
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        if (!disabled) {
          router.back();
        }
      }}
      {...variantProps}
      disabled={disabled}
    >
      {children ?? (
        <>
          <ArrowLeftIcon className="size-3" />
          Previous
        </>
      )}
    </Button>
  );
}
