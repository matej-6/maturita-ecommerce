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
  ProductTranslationSheetForm,
  ProductTranslationFormProps,
} from "../../forms/product-translation-sheet-form";
import { useTranslations } from "next-intl";

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
  const ft = useTranslations("fields.productTranslation");
  const t = useTranslations("admin.products.productDetail.page.translations");

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
          <span className="text-muted-foreground text-xs">{ft("title")}</span>
          <p>{name}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">
            {ft("description")}
          </span>
          <p>{description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-x-2 justify-center">
          <ProductTranslationSheetForm {...formProps} />

          <Button
            disabled={isDeleting}
            onClick={() => deleteTranslation()}
            variant={confirmation ? "destructive" : "secondary"}
          >
            {confirmation ? t("deleteConfirmButton") : t("deleteButton")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
