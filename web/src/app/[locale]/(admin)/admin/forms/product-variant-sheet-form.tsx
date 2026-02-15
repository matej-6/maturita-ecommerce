"use client";

import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  createVariantAction,
  editVariantAction,
} from "@/app/data-access-layer/admin/product/actions";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
import { VariantProps } from "class-variance-authority";

type ProductVariantFormProps = {
  mode: "create" | "edit";
  initialData?: FormData;
  productId: number;
  productVariantId?: number;
  allAttributes: {
    id: number;
    keyId: number;
    key: string;
    value: string;
  }[];
  buttonVariant?: VariantProps<typeof Button>["variant"];
};

type FormData = {
  sku: string;
  priceInCents: number;
  isPublic: boolean;
  stock: number;
  attributes: number[];
};

export const ProductVariantSheetForm = ({
  initialData = {
    sku: "",
    priceInCents: 0,
    isPublic: true,
    stock: 0,
    attributes: [],
  },
  productId,
  productVariantId,
  mode = "create",
  allAttributes,
  buttonVariant = "default",
}: ProductVariantFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  const isFormChanged = useMemo(() => {
    return (
      formData.sku !== initialData.sku ||
      formData.priceInCents !== initialData.priceInCents ||
      formData.isPublic !== initialData.isPublic ||
      formData.stock !== initialData.stock ||
      formData.attributes.length !== initialData.attributes.length ||
      !formData.attributes.every(
        (value, index) => value === initialData.attributes[index],
      )
    );
  }, [formData, initialData]);

  // translations
  const ft = useTranslations("fields"); // fields translations
  const t = useTranslations("admin.productVariant.form"); // specific form translations

  const attributeKeys = useMemo(() => {
    return Array.from(new Set(allAttributes.map((attr) => attr.keyId))).map(
      (keyId) => {
        const attr = allAttributes.find((a) => a.keyId === keyId)!;
        return { id: keyId, key: attr.key };
      },
    );
  }, [allAttributes]);

  const [selectedAttributeKey, setSelectedAttributeKey] = useState<{
    id: number;
    key: string;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(
    null,
  );

  const getAttributesForSelectedKey = useCallback(
    (keyId: number | null) => {
      const availableAttributes = allAttributes.filter(
        (attr) => !formData.attributes.some((a) => a === attr.id),
      );
      if (keyId === null) return availableAttributes;
      return availableAttributes.filter((attr) => attr.keyId === keyId);
    },
    [allAttributes, formData],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (mode === "edit") {
        const res = await editVariantAction(
          productId,
          productVariantId!,
          formData,
        );
        if (!res.success) {
          const fieldErrorsMap = new Map();
          res.fieldErrors?.forEach((e) =>
            fieldErrorsMap.set(e.property, e.constraints),
          );
          setFieldErrors(fieldErrorsMap);
          setErrorMessage(res.message);
        } else {
          setFieldErrors(undefined);
          setErrorMessage(undefined);
        }
      } else {
        const res = await createVariantAction(productId, formData);
        if (!res.success) {
          const fieldErrorsMap = new Map();
          res.fieldErrors?.forEach((e) =>
            fieldErrorsMap.set(e.property, e.constraints),
          );
          setFieldErrors(fieldErrorsMap);
          setErrorMessage(res.message);
        } else {
          setFieldErrors(undefined);
          setErrorMessage(undefined);
        }
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={buttonVariant} className="w-fit">
          {mode === "edit"
            ? t("triggerButtonUpdate")
            : t("triggerButtonCreate")}
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0!">
        <SheetHeader className="p-2 sm:p-4">
          <SheetTitle>
            {mode === "edit" ? t("titleUpdate") : t("titleCreate")}
          </SheetTitle>
        </SheetHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-8 p-2 sm:p-4"
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="sku">{ft("productVariant.sku")}</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sku: e.target.value }))
                }
              />
              <FormFieldErrorMessage
                fieldName="sku"
                fieldErrors={fieldErrors}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="priceInCents">
                {ft("productVariant.priceInCents")}
              </Label>
              <Input
                id="priceInCents"
                type="number"
                min={0}
                value={formData.priceInCents}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priceInCents: Number(e.target.value),
                  }))
                }
              />
              <FormFieldErrorMessage
                fieldName="priceInCents"
                fieldErrors={fieldErrors}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="stock">{ft("productVariant.stock")}</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock: Number(e.target.value),
                  }))
                }
              />
              <FormFieldErrorMessage
                fieldName="stock"
                fieldErrors={fieldErrors}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="isPublic">{ft("productVariant.isPublic")}</Label>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isPublic: checked }))
                }
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="attributes">
                {ft("productVariant.attributes")}
              </Label>
              <Select
                value={selectedAttributeKey?.id.toString() ?? "null"}
                onValueChange={(v) => {
                  if (v === "null") {
                    setSelectedAttributeKey(null);
                    return;
                  }
                  setSelectedAttributeKey(
                    attributeKeys.find((a) => a.id === Number(v))!,
                  );
                }}
              >
                <SelectTrigger>
                  {t("selectKeyToFilterAttributes")}
                </SelectTrigger>
                <SelectContent>
                  {attributeKeys.map((key) => (
                    <SelectItem key={key.id} value={key.id.toString()}>
                      {key.key}
                    </SelectItem>
                  ))}
                  <SelectItem value="null">{t("noFilter")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-y-2">
                <Select
                  value={selectedAttributeId?.toString() ?? "null"}
                  onValueChange={(v) => {
                    if (v === "null") {
                      return;
                    }
                    const attrId = Number(v);

                    setFormData((prev) => ({
                      ...prev,
                      attributes: [attrId, ...prev.attributes],
                    }));
                  }}
                >
                  <SelectTrigger>
                    {ft("productVariant.selectAttribute")}
                  </SelectTrigger>
                  <SelectContent>
                    {getAttributesForSelectedKey(
                      selectedAttributeKey?.id ?? null,
                    ).map((attr) => (
                      <SelectItem key={attr.id} value={attr.id.toString()}>
                        {attr.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  {formData.attributes.map((attrId) => {
                    const attr = allAttributes.find((a) => a.id === attrId)!;
                    return (
                      <div
                        key={attr.id}
                        className="px-2 py-1 bg-secondary rounded-md flex items-center gap-x-2 group"
                      >
                        <span className="text-secondary-foreground text-sm">
                          {attr.key}: {attr.value}
                        </span>
                        <Button
                          size={"xs"}
                          variant={"destructive"}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const newAttributes = prev.attributes.filter(
                                (id) => id !== attr.id,
                              );
                              return { ...prev, attributes: newAttributes };
                            });
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-y-2">
            <Button
              type="submit"
              variant={"default"}
              className=" mt-auto"
              disabled={!isFormChanged || isPending}
            >
              {t("submitButton")}
            </Button>
            <SheetClose asChild>
              <Button variant="outline">{t("closeButton")}</Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
