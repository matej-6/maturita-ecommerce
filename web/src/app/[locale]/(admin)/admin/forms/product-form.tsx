"use client";

import { useForm } from "react-hook-form";
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
import { useState } from "react";
import { ReactHookFormFieldErrorMessage } from "@/components/form/reactHookFormFieldErrorMessage";
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
  productFormSchema,
  productFormSchemaType,
} from "../schemas/product-form-schema";
import {
  createProductAction,
  editProductAction,
} from "@/app/data-access-layer/admin/product/actions";
import { Switch } from "@/components/ui/switch";

type ProductFormProps = {
  mode: "create" | "edit";
  categories: {
    id: number;
    slug: string;
  }[];
  initialData?: productFormSchemaType;
  revalidatePaths?: string[];
  productId?: number;
};
export const ProductForm = ({
  initialData,
  productId,
  mode = "create",
  categories,
  revalidatePaths = [],
}: ProductFormProps) => {
  // translations
  const formt = useTranslations("form"); // general form translations
  const ft = useTranslations("fields"); // fields translations
  const cft = useTranslations("admin.products.newProduct.form"); // specific form translations

  const comboboxCategories = [
    { label: cft("categoryId.combobox.emptyValueLabel"), value: null },
    ...(categories.map((c) => ({
      label: c.slug,
      value: c.id,
    })) ?? []),
  ];

  const formSchema = productFormSchema(formt, ft);

  const form = useForm<productFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      slug: initialData?.slug ?? "",
      categoryId: initialData?.categoryId ?? null,
      isPublic: initialData?.isPublic ?? false,
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: productFormSchemaType) => {
      if (mode === "edit") {
        const res = await editProductAction(
          {
            ...data,
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
        const res = await createProductAction(data);
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          await mutate(data);
        })}
        className="flex flex-col gap-y-8 max-w-[600px] h-full"
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
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("product.categoryId")}</FormLabel>
              <FormComboBox
                data={comboboxCategories}
                selectedStatus={
                  comboboxCategories.find((c) => c.value === field.value)!
                }
                setSelectedValue={(v) =>
                  form.setValue("categoryId", v, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              />
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-3 rounded-md border p-3">
              <FormLabel>{ft("product.isPublic")}</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}
        <Button
          type="submit"
          variant={"default"}
          className="mt-auto"
          disabled={
            !form.formState.isValid || !form.formState.isDirty || isPending
          }
        >
          {mode === "create"
            ? cft("submitButtonCreate")
            : cft("submitButtonUpdate")}
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
