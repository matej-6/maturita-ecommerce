"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

type Props = VariantProps<typeof buttonVariants> &
  ComponentPropsWithRef<"button">;

export function ResponsiveButton({ children, className, ...rest }: Props) {
  return (
    <>
      <Button
        className={cn("block xs:hidden", className)}
        size={"xs"}
        {...rest}
      >
        {children}
      </Button>
      <Button
        className={cn("hidden xs:block sm:hidden", className)}
        size={"sm"}
        {...rest}
      >
        {children}
      </Button>
      <Button
        className={cn("hidden sm:block", className)}
        size={"default"}
        {...rest}
      >
        {children}
      </Button>
    </>
  );
}
