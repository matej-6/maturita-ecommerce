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
import {
  productVariantAttributeKeyFormSchema,
  productVariantAttributeKeyFormSchemaType,
} from "../schemas/attribute-key-form-schema";
import {
  createAttributeKeyAction,
  editAttributeKeyAction,
} from "@/app/data-access-layer/admin/product-variant-attribute/actions";

type AttributeKeyFormProps = {
  mode: "create" | "edit";
  initialData?: productVariantAttributeKeyFormSchemaType;
  productId?: number;
  keyId?: number;
};
export const AttributeKeyForm = ({
  initialData,
  productId,
  mode = "create",
  keyId,
}: AttributeKeyFormProps) => {
  // translations
  const formt = useTranslations("form"); // general form translations
  const ft = useTranslations("fields"); // fields translations
  const cft = useTranslations("admin.productVariant.attributeKey.form"); // specific form translations

  const formSchema = productVariantAttributeKeyFormSchema(formt, ft);

  const form = useForm<productVariantAttributeKeyFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      key: initialData?.key || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: productVariantAttributeKeyFormSchemaType) => {
      const res =
        mode === "edit"
          ? await editAttributeKeyAction(keyId!, data, productId)
          : await createAttributeKeyAction(data, productId);
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
          await mutate(data);
        })}
        className="flex flex-col gap-y-8 max-w-[600px] h-full"
      >
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("productVariant.attribute.key")}</FormLabel>
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
          disabled={!form.formState.isValid || !form.formState.isDirty || isPending}
        >
          {cft("submitButton")}
        </Button>
      </form>
    </Form>
  );
};
