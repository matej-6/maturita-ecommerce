"use client";

import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
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
import { editCategoryAction } from "@/app/data-access-layer/admin/category/actions";
import { toast } from "sonner";
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

type EditCategoryFormProps = {
  categoryId: number;
  initialData: EditCategoryFormData;
  data: {
    allCategories: {
      id: number;
      parentCategoryId?: number | null;
      slug: string;
    }[];
  };
};

type EditCategoryFormData = {
  slug: string;
  parentCategoryId: number | null;
};

export const EditCategorySheetForm = ({
  categoryId,
  initialData,
  data,
}: EditCategoryFormProps) => {
  const [formData, setFormData] = useState<EditCategoryFormData>(initialData);
  const isFormChanged = useMemo(() => {
    return (
      formData.slug !== initialData.slug ||
      formData.parentCategoryId !== initialData.parentCategoryId
    );
  }, [formData, initialData]);

  const availableCategories = useMemo(() => {
    if (!data?.allCategories) {
      return [];
    }
    const categoriesToSubcategories = new Map<number, number[]>();
    const categoryMap = new Map<
      number,
      { id: number; parentCategoryId?: number | null; slug: string }
    >();
    const res = [];
    for (const c of data.allCategories) {
      if (c.parentCategoryId != null) {
        categoryMap.set(c.id, c);
        const subcategories =
          categoriesToSubcategories.get(c.parentCategoryId) ?? [];
        subcategories.push(c.id);
        categoriesToSubcategories.set(c.parentCategoryId, subcategories);
      } else if (c.id !== categoryId) {
        res.push(c);
      }
    }

    const queue = [categoryId];

    while (queue.length > 0) {
      const c = queue.pop()!;
      categoryMap.delete(c);
      for (const subc of categoriesToSubcategories.get(c) ?? []) {
        queue.push(subc);
      }
    }

    return [...res, ...categoryMap.values()];
  }, [data, categoryId]);

  const t = useTranslations("admin.categories.editCategory.form"); // specific form translations
  const ft = useTranslations("fields.category");

  const comboboxCategories = [
    { label: t("parentCategoryId.combobox.emptyValueLabel"), value: null },
    ...(availableCategories.map((c) => ({
      label: c.slug,
      value: c.id,
    })) ?? []),
  ];

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await editCategoryAction(categoryId, formData);
      if (res.success) {
        toast.success(t("toastSuccess"));
        setErrorMessage(undefined);
        return;
      }
      const fieldErrorsMap = new Map();
      res.fieldErrors?.forEach((e) =>
        fieldErrorsMap.set(e.property, e.constraints)
      );
      setFieldErrors(fieldErrorsMap);
      setErrorMessage(res.message);
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
        <Button>{t("triggerButton")}</Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <SheetHeader className="p-2 sm:p-4">
          <SheetTitle>{t("title")}</SheetTitle>
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
              <Label htmlFor="slug">{ft("slug")}</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
              />
              <FormFieldErrorMessage
                fieldErrors={fieldErrors}
                fieldName="slug"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="parentCategoryId">{ft("parentCategoryId")}</Label>
              <FormComboBox
                data={comboboxCategories}
                selectedStatus={
                  comboboxCategories.find(
                    (c) => c.value === formData.parentCategoryId
                  )!
                }
                setSelectedValue={(v) =>
                  setFormData((prev) => ({ ...prev, parentCategoryId: v }))
                }
                noResultsFoundText={t(
                  "parentCategoryId.combobox.noResultsFoundText"
                )}
                filterPlaceholderText={t(
                  "parentCategoryId.combobox.filterPlaceholderText"
                )}
              />
              <FormFieldErrorMessage
                fieldErrors={fieldErrors}
                fieldName="parentCategoryId"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-y-2">
            <Button
              type="submit"
              variant={"default"}
              disabled={!isFormChanged}
              className="mt-auto"
            >
              {t("submitButton")}
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

type Status = {
  value: number | null;
  label: string;
};

type FormComboBoxProps = {
  data: Status[];
  selectedStatus: Status;
  setSelectedValue: (value: Status["value"]) => void;
  filterPlaceholderText?: string;
  noResultsFoundText?: string;
};

function FormComboBox({
  data,
  selectedStatus,
  setSelectedValue,
  filterPlaceholderText,
  noResultsFoundText,
}: FormComboBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="justify-start">
          {selectedStatus.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[196px] p-0" align="start">
        <Command>
          <CommandInput placeholder={filterPlaceholderText} />
          <CommandList>
            <CommandEmpty>{noResultsFoundText}</CommandEmpty>
            <CommandGroup>
              {data.map((option) => (
                <CommandItem
                  key={option.value?.toString() ?? "null"}
                  value={option.value?.toString() ?? "null"}
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
