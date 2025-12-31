"use client";

import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "@/i18n/navigation";

import {
  createProductAction,
  editProductAction,
} from "@/app/data-access-layer/admin/product/actions";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";

type ProductFormProps = {
  mode: "create" | "edit";
  categories: {
    id: number;
    slug: string;
  }[];
  initialData?: {
    slug: string;
    categoryId: number | null;
    isPublic: boolean;
  };
  revalidatePaths?: string[];
  productId?: number;
};
export const ProductForm = ({
  initialData = {
    slug: "",
    categoryId: null,
    isPublic: false,
  },
  productId,
  mode = "create",
  categories,
  revalidatePaths = [],
}: ProductFormProps) => {
  // translations
  const ft = useTranslations("fields"); // fields translations
  const t = useTranslations("admin.products.form"); // specific form translations

  const [formData, setFormData] = useState(initialData);

  const isFormChanged = useMemo(() => {
    return (
      formData.slug !== initialData.slug ||
      formData.categoryId !== initialData.categoryId ||
      formData.isPublic !== initialData.isPublic
    );
  }, [formData, initialData]);

  const comboboxCategories = [
    { label: t("categoryId.combobox.emptyValueLabel"), value: null },
    ...(categories.map((c) => ({
      label: c.slug,
      value: c.id,
    })) ?? []),
  ];

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (mode === "edit") {
        const res = await editProductAction(
          {
            ...formData,
            id: productId!,
          },
          revalidatePaths
        );
        if (!res.success) {
          const fieldErrorsMap = new Map();
          res.fieldErrors?.forEach((e) =>
            fieldErrorsMap.set(e.property, e.constraints)
          );
          setFieldErrors(fieldErrorsMap);
          setErrorMessage(res.message);
        }
      } else {
        const res = await createProductAction(formData);
        if (res.success) {
          router.push(`/admin/products/product-detail/${res.data.id}`);
          return;
        }
        const fieldErrorsMap = new Map();
        res.fieldErrors?.forEach((e) =>
          fieldErrorsMap.set(e.property, e.constraints)
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
    undefined
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          {mode === "create"
            ? t("triggerButtonCreate")
            : t("triggerButtonUpdate")}
        </Button>
      </SheetTrigger>
      <SheetContent className="grow">
        <SheetHeader className="p-4!">
          <SheetTitle>
            {mode === "create" ? t("titleCreate") : t("titleUpdate")}
          </SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-8 p-4"
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="slug">{ft("category.slug")}</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
            />
            <FormFieldErrorMessage fieldErrors={fieldErrors} fieldName="slug" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="categoryId">{ft("product.categoryId")}</Label>
            <FormComboBox
              data={comboboxCategories}
              selectedStatus={
                comboboxCategories.find((c) => c.value === formData.categoryId)!
              }
              setSelectedValue={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  categoryId: v,
                }))
              }
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="categoryId"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-3 rounded-md border p-3">
              <Label>{ft("product.isPublic")}</Label>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isPublic: checked }))
                }
              />
            </div>
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="isPublic"
            />
          </div>
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <Button
            type="submit"
            variant={"default"}
            className="mt-auto"
            disabled={isPending || !isFormChanged}
          >
            {mode === "create"
              ? t("submitButtonCreate")
              : t("submitButtonUpdate")}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );

  type Status = {
    value: number | null;
    label: string;
  };

  type FormComboBoxProps = {
    data: Status[];
    selectedStatus: Status;
    setSelectedValue: (value: Status["value"]) => void;
  };

  function FormComboBox({
    data,
    selectedStatus,
    setSelectedValue,
  }: FormComboBoxProps) {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="justify-start">
            {selectedStatus.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Filter categories" />
            <CommandList>
              <CommandEmpty>No categories found</CommandEmpty>
              <CommandGroup>
                {data.map((option) => (
                  <CommandItem
                    key={option.value?.toString() ?? "null"}
                    value={option.value?.toString() || "null"}
                    onSelect={(v) => {
                      setSelectedValue(v === "null" ? null : parseInt(v));
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
};
