"use client";

import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import {
  createCategoryTranslationAction,
  editCategoryTranslationAction,
} from "@/app/data-access-layer/admin/category-translation/actions";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ResponsiveButton } from "@/components/responsive-button";

export type CategoryTranslationSheetFormProps = {
  categoryId: number;
  translationId?: number;
  availableLocales: {
    label: string;
    value: string;
  }[];
  mode: "create" | "edit";
  initialData?: CategoryTranslationFormData;
};

type CategoryTranslationFormData = {
  name: string;
  description?: string;
  locale: string;
};

export const CategoryTranslationSheetForm = ({
  availableLocales,
  categoryId,
  translationId,
  mode,
  initialData = {
    name: "",
    description: "",
    locale: "",
  },
}: CategoryTranslationSheetFormProps) => {
  const ft = useTranslations("fields");
  const t = useTranslations(
    "admin.categories.editCategory.page.translations.form",
  );

  const [formData, setFormData] = useState<CategoryTranslationFormData>({
    name: initialData.name,
    description: initialData.description,
    locale: initialData.locale,
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isFormChanged =
    formData.name !== initialData.name ||
    (formData.description || "") !== (initialData.description || "") ||
    formData.locale !== initialData.locale;

  useEffect(() => {
    if (availableLocales.length === 0) {
      setIsSheetOpen(false);
    }
  }, [availableLocales]);

  if (mode === "edit" && !translationId) {
    throw new Error("translation id must be provided to edit translation");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res =
        mode === "create"
          ? await createCategoryTranslationAction(categoryId!, formData)
          : await editCategoryTranslationAction(
              categoryId!,
              translationId!,
              formData,
            );

      const fieldErrorsMap = new Map();
      if (res.success) {
        setErrorMessage(undefined);
        setFieldErrors(fieldErrorsMap);
      } else {
        res.fieldErrors?.forEach((e) =>
          fieldErrorsMap.set(e.property, e.constraints),
        );
        setFieldErrors(fieldErrorsMap);
        setErrorMessage(res.message);
      }
    },
  });

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        {mode === "create" ? (
          <ResponsiveButton disabled={availableLocales.length === 0}>
            {t("triggerButtonCreate")}
          </ResponsiveButton>
        ) : (
          <ResponsiveButton>{t("triggerButtonUpdate")}</ResponsiveButton>
        )}
      </SheetTrigger>
      <SheetContent className="p-0">
        <SheetHeader className="p-2 sm:p-4">
          <SheetTitle>
            {mode === "create" ? t("titleCreate") : t("titleUpdate")}
          </SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-8 p-2 sm:p-4"
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="name">{ft("categoryTranslation.name")}</Label>
              <Input
                minLength={1}
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <FormFieldErrorMessage
                fieldName="name"
                fieldErrors={fieldErrors}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="description">
                {ft("categoryTranslation.description")}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <FormFieldErrorMessage
                fieldName="description"
                fieldErrors={fieldErrors}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Select
                value={formData.locale}
                onValueChange={(v) => {
                  setFormData((prev) => ({ ...prev, locale: v }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    className="w-full"
                    placeholder={ft("locale.code")}
                  />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {availableLocales.map((l) => (
                    <SelectItem
                      className="w-full"
                      value={l.value}
                      key={l.value}
                    >
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldErrorMessage
                fieldName="locale"
                fieldErrors={fieldErrors}
              />
            </div>
          </div>
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}

          <div className="flex flex-col gap-y-2">
            <Button type="submit" disabled={isPending || !isFormChanged}>
              {mode === "create"
                ? isPending
                  ? t("submitButtonCreatePending")
                  : t("submitButtonCreate")
                : isPending
                  ? t("submitButtonUpdatePending")
                  : t("submitButtonUpdate")}
            </Button>
            <SheetClose asChild>
              <Button variant={"outline"}>{t("closeButton")}</Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
