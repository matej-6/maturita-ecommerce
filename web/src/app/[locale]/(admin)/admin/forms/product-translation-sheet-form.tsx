"use client";

import MDEditor from "@uiw/react-md-editor";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
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
import {
  createProductTranslationAction,
  editProductTranslationAction,
} from "@/app/data-access-layer/admin/product-translation/actions";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";

export type ProductTranslationFormProps = {
  productId: number;
  translationId?: number;
  availableLocales: {
    label: string;
    value: string;
  }[];
  mode?: "create" | "edit";
  initialData?: FormData;
};

type FormData = {
  name: string;
  locale: string;
  description?: string;
  markdownContent?: string;
};

export const ProductTranslationSheetForm = ({
  availableLocales,
  productId,
  translationId,
  mode = "create",
  initialData = {
    name: "",
    locale: availableLocales[0]?.value || "",
    description: "",
    markdownContent: "",
  },
}: ProductTranslationFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (mode === "create" && availableLocales.length === 0) {
      setSheetOpen(false);
    }
  }, [mode, availableLocales]);

  const isFormChanged =
    formData.name !== initialData.name ||
    formData.description !== initialData.description ||
    formData.locale !== initialData.locale ||
    formData.markdownContent !== initialData.markdownContent;

  const ft = useTranslations("fields");
  const t = useTranslations(
    "admin.products.productDetail.page.translations.form",
  );

  if (mode === "edit" && !translationId) {
    throw new Error("translation id must be provided to edit translation");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res =
        mode === "create"
          ? await createProductTranslationAction(productId, formData)
          : await editProductTranslationAction(
              translationId!,
              productId,
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
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button disabled={mode === "create" && availableLocales.length === 0}>
          {mode === "edit"
            ? t("triggerButtonUpdate")
            : t("triggerButtonCreate")}
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0! min-w-[600px] h-full overflow-y-scroll">
        <SheetHeader className="p-2 sm:p-4">
          <SheetTitle>
            {mode === "edit" ? t("titleUpdate") : t("titleCreate")}
          </SheetTitle>
        </SheetHeader>
        {sheetOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate();
            }}
            className="flex flex-col gap-y-8 p-2 sm:p-4"
          >
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="name">{ft("productTranslation.title")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <FormFieldErrorMessage
                  fieldErrors={fieldErrors}
                  fieldName="name"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="description">
                  {ft("productTranslation.description")}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <FormFieldErrorMessage
                  fieldErrors={fieldErrors}
                  fieldName="description"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="locale">{ft("locale.code")}</Label>
                <Select
                  value={formData.locale}
                  onValueChange={(value) =>
                    setFormData({ ...formData, locale: value })
                  }
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
                  fieldErrors={fieldErrors}
                  fieldName="locale"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="content">
                  {ft("productTranslation.content")}
                </Label>
                <MDEditor
                  data-color-mode="light"
                  className="min-h-[600px]"
                  value={formData.markdownContent}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      markdownContent: value || "",
                    })
                  }
                />
                <FormFieldErrorMessage
                  fieldErrors={fieldErrors}
                  fieldName="markdownContent"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-destructive text-sm">{errorMessage}</p>
            )}

            <div className="flex flex-col gap-y-2">
              <Button type="submit" disabled={!isFormChanged || isPending}>
                {mode === "create"
                  ? t("submitButtonCreate")
                  : t("submitButtonUpdate")}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">{t("closeButton")}</Button>
              </SheetClose>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};
