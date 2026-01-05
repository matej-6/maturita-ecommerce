"use client";

import {
  createAttributeKeyTranslationAction,
  updateAttributeKeyTranslationAction,
} from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
import { ResponsiveButton } from "@/components/responsive-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  attributeKeyId: number;
  locales: {
    code: string;
    name: string;
  }[];
  initialData?: FormData & {
    keyTranslationId: number;
  };
};

type FormData = {
  locale: string;
  keyTranslation: string;
};

export function AttributeKeyTranslationSheetForm({
  attributeKeyId,
  locales,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    locale: initialData?.locale || "",
    keyTranslation: initialData?.keyTranslation || "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let result;
      if (!initialData) {
        result = await createAttributeKeyTranslationAction({
          attributeKeyId,
          keyTranslation: formData.keyTranslation,
          locale: formData.locale,
        });
      } else {
        result = await updateAttributeKeyTranslationAction(
          {
            id: initialData.keyTranslationId,
            keyTranslation: formData.keyTranslation,
            locale: formData.locale,
          },
          attributeKeyId
        );
      }
      if (!result.success) {
        const fieldErrorsMap = new Map();
        result.fieldErrors?.forEach((e) =>
          fieldErrorsMap.set(e.property, e.constraints)
        );
        setFieldErrors(fieldErrorsMap);
        setErrorMessage(result.message);
      } else {
        setFieldErrors(undefined);
        setErrorMessage(undefined);
      }
    },
  });

  const t = useTranslations("admin.attributeKeys.translationForm");
  const ft = useTranslations("fields.attributeKey");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton disabled={!initialData && locales.length === 0}>
          {initialData ? t("triggerButtonUpdate") : t("triggerButtonCreate")}
        </ResponsiveButton>
      </SheetTrigger>

      <SheetContent className="grow">
        <SheetHeader>
          <SheetTitle>
            {initialData ? t("titleUpdate") : t("titleCreate")}
          </SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-3 sm:gap-y-6 px-4 grow"
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="keyTranslation">{ft("key")}</Label>
            <Input
              id="keyTranslation"
              type="text"
              value={formData.keyTranslation}
              onChange={handlechange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="keyTranslation"
            />
          </div>
          <Select
            value={formData.locale}
            onValueChange={(v) => {
              setFormData((prev) => ({
                ...prev,
                locale: v,
              }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("languageSelect.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem key={locale.code} value={locale.code}>
                  {locale.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-red-600">{errorMessage}</p>
          <div className="flex flex-col gap-y-2 mt-auto pb-4">
            <Button type="submit" disabled={isPending}>
              {initialData
                ? isPending
                  ? t("submitButtonUpdatePending")
                  : t("submitButtonUpdate")
                : isPending
                ? t("submitButtonCreatePending")
                : t("submitButtonCreate")}
            </Button>
            <SheetClose asChild>
              <Button variant={"outline"}>{t("closeButton")}</Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
