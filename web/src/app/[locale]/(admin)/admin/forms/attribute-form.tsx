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
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { createAttributeAction } from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import {
  productVariantAttributeFormSchema,
  productVariantAttributeFormSchemaType,
} from "../schemas/product-variant-attribute-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

type AttributeForm = {
  mode: "create" | "edit";
  initialData?: productVariantAttributeFormSchemaType;
  productId?: number;
  keyId?: number;
  availableKeys: { id: number; key: string }[];
};
export const AttributeForm = ({
  initialData,
  productId,
  mode = "create",
  keyId,
  availableKeys,
}: AttributeForm) => {
  // translations
  const formt = useTranslations("form"); // general form translations
  const ft = useTranslations("fields"); // fields translations
  const cft = useTranslations("admin.productVariant.attributeKey.form"); // specific form translations

  const formSchema = productVariantAttributeFormSchema(formt, ft);

  const form = useForm<productVariantAttributeFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      attributeKeyId: initialData?.attributeKeyId || availableKeys[0].id,
      attributeValue: initialData?.attributeValue || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: productVariantAttributeFormSchemaType) => {
      const res = await createAttributeAction(data, productId);
      if (!res.success) {
        const fieldErrorsMap = new Map();
        res.fieldErrors?.forEach((e) =>
          fieldErrorsMap.set(e.property, e.constraints)
        );
        setFieldErrors(fieldErrorsMap);
        setErrorMessage(res.message);
      } else {
        setFieldErrors(undefined);
        setErrorMessage(undefined);
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
          mutate(data);
        })}
        className="flex flex-col gap-y-8 max-w-[600px] h-full"
      >
        <FormField
          control={form.control}
          name="attributeKeyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("productVariant.attribute.key")}</FormLabel>
              <FormControl>
                <Select
                  value={field.value?.toString() || undefined}
                  onValueChange={(v) => {
                    field.onChange(Number(v));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={ft("productVariant.attribute.key")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKeys.map((key) => (
                      <SelectItem key={key.id} value={key.id.toString()}>
                        {key.key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attributeValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("productVariant.attribute.value")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
          className="mt-auto"
          disabled={
            !form.formState.isValid || !form.formState.isDirty || isPending
          }
        >
          {cft("submitButton")}
        </Button>
      </form>
    </Form>
  );
};
