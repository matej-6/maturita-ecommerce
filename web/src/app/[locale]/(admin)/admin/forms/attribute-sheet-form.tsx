"use client";

import {
  createAttributeAction,
  updateAttributeAction,
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
  showKeyOptions?: boolean;
  keys: {
    id: number;
    key: string;
  }[];
  initialData?: FormData & {
    id: number;
  };
};

type FormData = {
  keyId: number;
  value: string;
};

export function AttributeSheetForm({
  keys,
  initialData,
  showKeyOptions = true,
}: Props) {
  const t = useTranslations("admin.attributeKeys.attributeForm");
  const ft = useTranslations("fields");

  const [formData, setFormData] = useState<FormData>({
    keyId: initialData?.keyId || keys[0].id,
    value: initialData?.value || "",
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
        result = await createAttributeAction({
          attributeKeyId: formData.keyId,
          attributeValue: formData.value,
        });
      } else {
        result = await updateAttributeAction(
          initialData.id,
          formData.value,
          initialData.keyId
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
        <ResponsiveButton>
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
            <Label htmlFor="value">{ft("attribute.value")}</Label>
            <Input
              id="value"
              type="text"
              value={formData.value}
              onChange={handlechange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="value"
            />
          </div>
          {showKeyOptions && (
            <Select
              value={formData.keyId.toString()}
              onValueChange={(v) => {
                setFormData((prev) => ({
                  ...prev,
                  keyId: Number(v),
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("keySelect.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {keys.map((key) => (
                  <SelectItem key={key.id} value={key.id.toString()}>
                    {key.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <p className="text-red-600">{errorMessage}</p>
          <div className="flex flex-col gap-y-2 mt-auto pb-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? t("loadingButton") : t("submitButton")}
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
