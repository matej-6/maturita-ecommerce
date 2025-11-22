"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ProductTranslationForm } from "../../forms/product-translation-form";

type Props = {
  id: number;
  availableLocales: {
    label: string;
    value: string;
  }[];
};

export function AddProductTranslationSheet({ id, availableLocales }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet
      open={isSheetOpen && availableLocales.length > 0}
      onOpenChange={setIsSheetOpen}
    >
      <SheetTrigger asChild>
        <Button className="w-fit" disabled={availableLocales.length === 0}>
          Add Translation
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add translation</SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 px-4">
            {availableLocales.length > 0 && (
              <ProductTranslationForm
                availableLocales={availableLocales}
                mode="create"
                productId={id}
              />
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
