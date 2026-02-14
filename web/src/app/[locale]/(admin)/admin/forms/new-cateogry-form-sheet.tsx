"use client";

import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
import { createCategoryAction } from "@/app/data-access-layer/admin/category/actions";
import { useRouter } from "@/i18n/navigation";
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

type NewCategoryFormProps = {
  categories: {
    id: number;
    slug: string;
  }[];
};

export const NewCategoryFormSheet = ({ categories }: NewCategoryFormProps) => {
  // translations
  const ft = useTranslations("fields"); // fields translations
  const t = useTranslations("admin.categories.newCategory"); // specific form translations

  const [formState, setFormState] = useState<{
    slug: string;
    parentCategoryId: number | null;
  }>({
    slug: "",
    parentCategoryId: null,
  });

  const comboboxCategories = [
    { label: t("form.parentCategoryId.combobox.emptyValueLabel"), value: null },
    ...(categories.map((c) => ({
      label: c.slug,
      value: c.id,
    })) ?? []),
  ];

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await createCategoryAction(formState);
      if (res.success) {
        router.push(`/admin/categories/edit-category/${res.data.id}`);
        return;
      }
      const fieldErrorsMap = new Map();
      res.fieldErrors?.forEach((e) =>
        fieldErrorsMap.set(e.property, e.constraints),
      );
      setFieldErrors(fieldErrorsMap);
      setErrorMessage(res.message);
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
        <Button>{t("button")}</Button>
      </SheetTrigger>
      <SheetContent className="grow">
        <SheetHeader className="p-4!">
          <SheetTitle>{t("form.title")}</SheetTitle>
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
              value={formState.slug}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, slug: e.target.value }))
              }
            />
            <FormFieldErrorMessage fieldErrors={fieldErrors} fieldName="slug" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label>{ft("category.parentCategoryId")}</Label>
            <FormComboBox
              data={comboboxCategories}
              selectedStatus={
                comboboxCategories.find(
                  (c) => c.value === formState.parentCategoryId,
                )!
              }
              setSelectedValue={(v) =>
                setFormState((prev) => ({
                  ...prev,
                  parentCategoryId: v,
                }))
              }
              noResultsFoundText={t(
                "form.parentCategoryId.combobox.noResultsFoundText",
              )}
              filterPlaceholderText={t(
                "form.parentCategoryId.combobox.filterPlaceholderText",
              )}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="parentCategoryId"
            />
          </div>
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-y-2">
            <Button
              type="submit"
              variant={"default"}
              disabled={!formState.slug || isPending}
            >
              {t("form.submitButton")}
            </Button>
            <SheetClose asChild>
              <Button variant={"secondary"}>{t("form.closeButton")}</Button>
            </SheetClose>
          </div>
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
          <Button variant={"outline"} className="w-full justify-start">
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
