"use client";

import MDEditor from "@uiw/react-md-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { categoryTranslationSchemaType } from "../schemas/category-translation-schema";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ReactHookFormFieldErrorMessage } from "@/components/form/reactHookFormFieldErrorMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  productTranslationFormSchema,
  productTranslationFormSchemaType,
} from "../schemas/product-translation-schema";
import {
  createProductTranslationAction,
  editProductTranslationAction,
} from "@/app/data-access-layer/admin/product-translation/actions";

export type ProductTranslationFormProps = {
  productId: number;
  translationId?: number;
  availableLocales: {
    label: string;
    value: string;
  }[];
  mode: "create" | "edit";
  initialData?: productTranslationFormSchemaType;
};

export const ProductTranslationForm = ({
  availableLocales,
  productId,
  translationId,
  mode,
  initialData,
}: ProductTranslationFormProps) => {
  const formTranslations = useTranslations("form");
  const generalFieldTranslations = useTranslations("fields");
  // const formTranslations = useTranslations("admin.")

  if (mode === "create" && !productId) {
    throw new Error("product id must be provided to create new translation");
  }

  if (mode === "edit" && !translationId) {
    throw new Error("translation id must be provided to edit translation");
  }

  const formSchema = productTranslationFormSchema(
    formTranslations,
    generalFieldTranslations,
    availableLocales.map((l) => l.value)
  );

  const form = useForm<productTranslationFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      locale: initialData?.locale ?? availableLocales[0].value,
      markdownContent: initialData?.markdownContent ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: categoryTranslationSchemaType) => {
      const res =
        mode === "create"
          ? await createProductTranslationAction(productId, data)
          : await editProductTranslationAction(translationId!, productId, data);

      const fieldErrorsMap = new Map();
      if (res.success) {
        form.clearErrors();
        form.reset({
          name: res.data.name,
          description: res.data.description || "",
          locale: res.data.locale,
        });
        setErrorMessage(undefined);
        setFieldErrors(fieldErrorsMap);
      } else {
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
        onSubmit={form.handleSubmit(async (data) => await mutate(data))}
        className="flex flex-col gap-y-8 h-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {generalFieldTranslations("productTranslation.title")}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {generalFieldTranslations("productTranslation.description")}
              </FormLabel>
              <FormControl>
                <Textarea cols={8} {...field} />
              </FormControl>
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">
                {generalFieldTranslations("locale.code")}
              </FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      className="w-full"
                      placeholder={generalFieldTranslations("locale.code")}
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {availableLocales.map((l) => (
                      <SelectItem
                        className="w-full"
                        value={l.value}
                        key={l.value}
                      >
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="markdownContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {generalFieldTranslations("productTranslation.content")}
              </FormLabel>
              <FormControl>
                <MDEditor
                  data-color-mode="light"
                  className="min-h-[600px]"
                  {...field}
                />
              </FormControl>
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}

        <Button
          className="mt-auto"
          type="submit"
          disabled={
            !form.formState.isValid || !form.formState.isDirty || isPending
          }
        >
          {mode === "create" ? "Submit" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
};
