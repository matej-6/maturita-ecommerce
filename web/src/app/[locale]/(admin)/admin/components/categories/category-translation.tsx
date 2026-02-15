"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CategoryTranslationSheetForm,
  CategoryTranslationSheetFormProps,
} from "../../forms/category-translation-sheet-form";
import { useMutation } from "@tanstack/react-query";
import { deleteCategoryTranslationAction } from "@/app/data-access-layer/admin/category-translation/actions";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type CategoryTranslationProps = {
  categoryId: number;
  translationId: number;
  formProps: CategoryTranslationSheetFormProps;
  locale: {
    code: string;
    name: string;
    flag: string;
  };
  name: string;
  description?: string;
};

export function CategoryTranslation({
  formProps,
  locale,
  categoryId,
  translationId,
  name,
  description,
}: CategoryTranslationProps) {
  const ft = useTranslations("fields.category");
  const t = useTranslations("admin.categories.editCategory");

  const { mutate: deleteTranslation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!confirmation) {
        setConfirmation(true);
        setTimeout(() => {
          setConfirmation(false);
        }, 3000);
        return;
      }
      const res = await deleteCategoryTranslationAction(
        categoryId,
        translationId,
      );
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
          <span className="text-muted-foreground text-xs">{ft("name")}</span>
          <p>{name}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">
            {ft("description")}
          </span>
          <p>{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row gap-x-2">
        <CategoryTranslationSheetForm {...formProps} />

        <Button
          disabled={isDeleting}
          onClick={() => deleteTranslation()}
          variant={confirmation ? "destructive" : "secondary"}
        >
          {isDeleting
            ? t("page.translations.deletePendingButton")
            : confirmation
              ? t("page.translations.deleteConfirmButton")
              : t("page.translations.deleteButton")}
        </Button>
      </CardFooter>
    </Card>
  );
}
