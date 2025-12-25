"use client";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./ui/button";
import { ComponentPropsWithRef } from "react";

type Props = VariantProps<typeof buttonVariants> &
  ComponentPropsWithRef<"button">;

export function ResponsiveButton({ children, ...rest }: Props) {
  return (
    <>
      <Button className="block xs:hidden" size={"xs"} {...rest}>
        {children}
      </Button>
      <Button className="hidden xs:block sm:hidden" size={"sm"} {...rest}>
        {children}
      </Button>
      <Button className="hidden sm:block" size={"default"} {...rest}>
        {children}
      </Button>
    </>
  );
}
