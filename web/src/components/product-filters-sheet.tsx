"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ProductFilters, ProductFiltersProps } from "./product-filters";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  productFilterProps: ProductFiltersProps;
};

export function ProductFiltersSheet({ productFilterProps }: Props) {
  const [open, setIsOpen] = useState(false);

  const t = useTranslations("productFiltersSheet");

  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="w-fit">
          {t("triggerButton")}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="min-w-[300px]">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <div className="px-4 py-2">
          <ProductFilters
            {...productFilterProps}
            onApplyFilters={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
