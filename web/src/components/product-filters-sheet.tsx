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

type Props = {
  productFilterProps: ProductFiltersProps;
};

export function ProductFiltersSheet({ productFilterProps }: Props) {
  const [open, setIsOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-fit">
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="min-w-[300px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Use the filters to narrow down your search results.
          </SheetDescription>
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
