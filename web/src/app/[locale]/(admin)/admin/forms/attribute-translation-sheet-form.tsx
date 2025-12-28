"use client";

import {
  createAttributeKeyTranslationAction,
  createAttributeTranslationAction,
  updateAttributeKeyTranslationAction,
  updateAttributeTranslationAction,
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
import { useState } from "react";

type Props = {
  keyId: number;
  attributeId: number;
  locales: {
    code: string;
    name: string;
  }[];
  initialData?: FormData & {
    id: number;
  };
};

type FormData = {
  locale: string;
  valueTranslation: string;
};

export function AttributeTranslationSheetForm({
  attributeId,
  locales,
  initialData,
  keyId,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    locale: initialData?.locale || "",
    valueTranslation: initialData?.valueTranslation || "",
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
        result = await createAttributeTranslationAction(
          {
            id: attributeId,
            valueTranslation: formData.valueTranslation,
            locale: formData.locale,
          },
          keyId
        );
      } else {
        result = await updateAttributeTranslationAction(
          {
            id: initialData.id,
            valueTranslation: formData.valueTranslation,
            locale: formData.locale,
          },
          keyId
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton
          disabled={!initialData && locales.length === 0}
          variant="secondary"
        >
          {initialData ? "Edit Translation" : "Add Translation"}
        </ResponsiveButton>
      </SheetTrigger>

      <SheetContent className="grow">
        <SheetHeader>
          <SheetTitle>
            {initialData ? "Edit Translation" : "Add Translation"}
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
            <Label htmlFor="valueTranslation">Value Translation</Label>
            <Input
              id="valueTranslation"
              type="text"
              value={formData.valueTranslation}
              onChange={handlechange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="valueTranslation"
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
              <SelectValue placeholder="Select Locale" />
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
                  ? "Saving..."
                  : "Save Changes"
                : isPending
                ? "Creating..."
                : "Create Translation"}
            </Button>
            <SheetClose asChild>
              <Button variant={"outline"}>Close</Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
