"use client";

import { useForm } from "react-hook-form";
import {
  newCategoryFormSchema,
  newCategoryFormShemaType,
} from "./new-category-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExecutionResult } from "graphql";
import { FragmentType, getFragmentData } from "@/graphql";
import { Locales_QueryFragment } from "@/app/data-access-layer/admin/locale/fragments";
import { AllCategories_QueryFragment } from "@/app/data-access-layer/admin/category/fragments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { newCategoryTranslationSchema } from "./new-category-translation-schema";

type NewCategoryFormProps = {
  localesQueryPromise: Promise<
    ExecutionResult<FragmentType<typeof Locales_QueryFragment>>
  >;
  categoriesQueryPromise: Promise<
    ExecutionResult<FragmentType<typeof AllCategories_QueryFragment>>
  >;
};

export const NewCategoryForm = ({
  localesQueryPromise,
  categoriesQueryPromise,
}: NewCategoryFormProps) => {
  const localesQueryResult = use(localesQueryPromise);
  const localesData = getFragmentData(
    Locales_QueryFragment,
    localesQueryResult.data
  );

  const categoriesQueryResult = use(categoriesQueryPromise);
  const categoriesData = getFragmentData(
    AllCategories_QueryFragment,
    categoriesQueryResult.data
  );

  const ft = useTranslations("form"); // general form translations
  const ct = useTranslations("category"); // category translations
  const cft = useTranslations("admin.categories.newCategory.form"); // specific form translations

  const comboboxCategories = [
    { label: cft("parentCategoryId.combobox.emptyValueLabel"), value: "" },
    ...(categoriesData?.categories.map((c) => ({
      label: c.slug,
      value: c.id,
    })) ?? []),
  ];

  const formSchema = newCategoryFormSchema(ft, ct);

  const form = useForm<newCategoryFormShemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      slug: "",
      parentCategoryId: "",
      translations: [],
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: newCategoryFormShemaType) => {
      console.log(data);
    },
  });

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await mutate(data);
        })}
        className="flex flex-col gap-y-8 font-secondary"
      >
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ct("fields.slug")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ct("fields.parentCategoryId")}</FormLabel>
              <FormComboBox
                data={comboboxCategories}
                selectedStatus={
                  comboboxCategories.find((c) => c.value === field.value)!
                }
                setSelectedValue={(v) => form.setValue("parentCategoryId", v)}
                noResultsFoundText="No categories found"
                filterPlaceholderText="Filter categories"
              />
              <FormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />

        <h2>Translations</h2>

        <FormField
          control={form.control}
          name="translations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Translation</FormLabel>
              {localesData?.locales.map((locale) => {

                return null;
              })}
              <FormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle>English</CardTitle>
          </CardHeader>
          <CardContent>
            <div></div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant={"default"}
          disabled={form.formState.isReady}
        >
          {cft("submitButton")}
        </Button>
      </form>
    </Form>
  );

  type Status = {
    value: string;
    label: string;
  };

  type FormComboBoxProps = {
    data: Status[];
    selectedStatus: Status;
    setSelectedValue: (value: string) => void;
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
    const isMobile = useIsMobile();

    const StatusSelect = () => (
      <Command>
        <CommandInput placeholder={filterPlaceholderText} />
        <CommandList>
          <CommandEmpty>{noResultsFoundText}</CommandEmpty>
          <CommandGroup>
            {data.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(v) => {
                  setSelectedValue(v);
                  setOpen(false);
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );

    if (!isMobile) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="w-[196px] justify-start">
              {selectedStatus.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[196px] p-0" align="start">
            <StatusSelect />
          </PopoverContent>
        </Popover>
      );
    }
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant={"outline"} className="w-[196px] justify-start">
            {selectedStatus.label}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StatusSelect />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  function FormComboboxSkeleton({ buttonText }: { buttonText: string }) {
    return (
      <Button
        variant={"outline"}
        className="w-[196px] justify-start animate-pulse"
        disabled
      >
        {buttonText}
      </Button>
    );
  }
};
