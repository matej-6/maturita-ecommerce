"use client";

import { deleteProductTranslationAction } from "@/app/data-access-layer/admin/product-translation/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ProductTranslationForm,
  ProductTranslationFormProps,
} from "../../forms/product-translation-form";

type ProductTranslationProps = {
  translationId: number;
  locale: {
    code: string;
    name: string;
    flag: string;
  };
  name: string;
  description?: string;
  formProps: ProductTranslationFormProps;
  productId: number;
};

export function ProductTranslation({
  formProps,
  locale,
  translationId,
  name,
  description,
  productId,
}: ProductTranslationProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { mutate: deleteTranslation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!confirmation) {
        setConfirmation(true);
        setTimeout(() => {
          setConfirmation(false);
        }, 3000);
        return;
      }

      const res = await deleteProductTranslationAction(translationId, {
        id: productId,
      });

      if (!res.success) {
        toast.error(res.message);
      }
    },
  });

  const [confirmation, setConfirmation] = useState(false);

  return (
    <Card className="w-lg" key={locale.code}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {`${locale?.name} ${locale?.flag}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-auto">
        <div>
          <span className="text-muted-foreground text-xs">Name</span>
          <p>{name}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">Description</span>
          <p>{description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-x-2 justify-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>Edit</Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-scroll">
              <SheetHeader>
                <SheetTitle>Edit translation</SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4">
                  {isSheetOpen && <ProductTranslationForm {...formProps} />}
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
          <Button
            disabled={isDeleting}
            onClick={() => deleteTranslation()}
            variant={confirmation ? "destructive" : "secondary"}
          >
            {confirmation ? "Are you sure?" : "Delete"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
