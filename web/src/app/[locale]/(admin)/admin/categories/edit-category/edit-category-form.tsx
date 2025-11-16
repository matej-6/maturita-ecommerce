"use client";

import { useForm } from "react-hook-form";
import {
  categoryFormSchema,
  categoryFormSchemaType,
} from "../../schemas/category-form-schema";
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
import { useMemo, useState } from "react";
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
import { AllCategories_QueryFragment } from "@/app/data-access-layer/admin/category/fragments";
import { editCategoryAction } from "@/app/data-access-layer/admin/category/actions";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";

type EditCategoryFormProps = {
  categoryId: number;
  data: categoryFormSchemaType;
  categoriesQuery: ExecutionResult<
    FragmentType<typeof AllCategories_QueryFragment>
  >;
  refetchQueryKey?: unknown[];
};

export const EditCategoryForm = ({
  categoryId,
  data,
  categoriesQuery,
  refetchQueryKey,
}: EditCategoryFormProps) => {
  const categoriesData = getFragmentData(
    AllCategories_QueryFragment,
    categoriesQuery.data
  );

  const availableCategories = useMemo(() => {
    if (!categoriesData?.categories) {
      return [];
    }
    const categoriesToSubcategories = new Map<number, number[]>();
    const categoryMap = new Map<
      number,
      { id: number; parentCategoryId?: number | null; slug: string }
    >();
    const res = [];
    for (const c of categoriesData.categories) {
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
  }, [categoriesData, categoryId]);

  const queryClient = getQueryClient();

  // translations
  const formt = useTranslations("form"); // general form translations
  const ft = useTranslations("fields"); // fields translations
  const cft = useTranslations("admin.categories.editCategory.form"); // specific form translations

  const comboboxCategories = [
    { label: cft("parentCategoryId.combobox.emptyValueLabel"), value: null },
    ...(availableCategories.map((c) => ({
      label: c.slug,
      value: c.id,
    })) ?? []),
  ];

  const formSchema = categoryFormSchema(formt, ft);

  const form = useForm<categoryFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      slug: data.slug,
      parentCategoryId: data.parentCategoryId,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: categoryFormSchemaType) => {
      const res = await editCategoryAction(categoryId, data);
      if (res.success) {
        toast.success(cft("toastSuccess"));
        form.clearErrors();
        form.reset({
          parentCategoryId: res.data.parentCategoryId || null,
          slug: res.data.slug,
        });
        setErrorMessage(undefined);
        if (refetchQueryKey) {
          queryClient.refetchQueries({
            queryKey: refetchQueryKey,
            exact: true,
          });
        }
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await mutate(data);
        })}
        className="flex flex-col gap-y-8 h-full"
      >
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("category.slug")}</FormLabel>
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
              <FormLabel>{ft("category.parentCategoryId")}</FormLabel>
              <FormComboBox
                data={comboboxCategories}
                selectedStatus={
                  comboboxCategories.find((c) => c.value === field.value)!
                }
                setSelectedValue={(v) =>
                  form.setValue("parentCategoryId", v, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                noResultsFoundText="No categories found"
                filterPlaceholderText="Filter categories"
              />
              <FormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}
        <Button
          type="submit"
          variant={"default"}
          disabled={!form.formState.isValid || !form.formState.isDirty}
          className="mt-auto"
        >
          {cft("submitButton")}
        </Button>
      </form>
    </Form>
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
    const isMobile = useIsMobile();

    const StatusSelect = () => (
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
    );

    if (!isMobile) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="justify-start">
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
