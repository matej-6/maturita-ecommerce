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
import { useCallback, useMemo, useState } from "react";
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
import {
  createVariantAction,
  editVariantAction,
} from "@/app/data-access-layer/admin/product/actions";
import { Switch } from "@/components/ui/switch";
import {
  productVariantFormSchema,
  productVariantFormSchemaType,
} from "../schemas/product-variant-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";

type ProductVariantFormProps = {
  mode: "create" | "edit";
  initialData?: productVariantFormSchemaType;
  productId: number;
  productVariantId?: number;
  allAttributes: {
    id: number;
    keyId: number;
    key: string;
    value: string;
  }[];
};
export const ProductVariantForm = ({
  initialData,
  productId,
  productVariantId,
  mode = "create",
  allAttributes,
}: ProductVariantFormProps) => {
  // translations
  const formt = useTranslations("form"); // general form translations
  const ft = useTranslations("fields"); // fields translations
  const cft = useTranslations("admin.productVariant.form"); // specific form translations

  const formSchema = productVariantFormSchema(formt, ft);

  const form = useForm<productVariantFormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      sku: initialData?.sku || "",
      priceInCents: initialData?.priceInCents || 0,
      isPublic: initialData?.isPublic ?? true,
      stock: initialData?.stock || 0,
      attributes: initialData?.attributes || [],
    },
  });

  const attributeKeys = useMemo(() => {
    return Array.from(new Set(allAttributes.map((attr) => attr.keyId))).map(
      (keyId) => {
        const attr = allAttributes.find((a) => a.keyId === keyId)!;
        return { id: keyId, key: attr.key };
      }
    );
  }, [allAttributes]);

  const [selectedAttributeKey, setSelectedAttributeKey] = useState<{
    id: number;
    key: string;
  } | null>(null);

  const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(
    null
  );

  const getAttributesForSelectedKey = useCallback(
    (keyId: number | null) => {
      const availableAttributes = allAttributes.filter(
        (attr) => !form.getValues("attributes")?.some((a) => a === attr.id)
      );
      if (keyId === null) return availableAttributes;
      return availableAttributes.filter((attr) => attr.keyId === keyId);
    },
    [allAttributes, form]
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: productVariantFormSchemaType) => {
      if (mode === "edit") {
        const res = await editVariantAction(productId, productVariantId!, data);
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
      } else {
        const res = await createVariantAction(productId, data);
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
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("productVariant.sku")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("productVariant.priceInCents")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={0} />
              </FormControl>
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("productVariant.stock")}</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={0} />
              </FormControl>
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
        <FormField
          control={form.control}
          name="attributes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ft("productVariant.attributes")}</FormLabel>
              <Select
                value={selectedAttributeKey?.id.toString() ?? "null"}
                onValueChange={(v) => {
                  if (v === "null") {
                    setSelectedAttributeKey(null);
                    return;
                  }
                  setSelectedAttributeKey(
                    attributeKeys.find((a) => a.id === Number(v))!
                  );
                }}
              >
                <SelectTrigger>Select key to filter attributes</SelectTrigger>
                <SelectContent>
                  {attributeKeys.map((key) => (
                    <SelectItem key={key.id} value={key.id.toString()}>
                      {key.key}
                    </SelectItem>
                  ))}
                  <SelectItem value="null">No filter</SelectItem>
                </SelectContent>
              </Select>
              <FormControl>
                <div className="flex flex-col gap-y-2">
                  <Select
                    value={selectedAttributeId?.toString() ?? "null"}
                    onValueChange={(v) => {
                      if (v === "null") {
                        return;
                      }
                      const attrId = Number(v);

                      field.onChange([attrId, ...(field.value ?? [])]);
                    }}
                  >
                    <SelectTrigger>
                      {ft("productVariant.selectAttribute")}
                    </SelectTrigger>
                    <SelectContent>
                      {getAttributesForSelectedKey(
                        selectedAttributeKey?.id ?? null
                      ).map((attr) => (
                        <SelectItem key={attr.id} value={attr.id.toString()}>
                          {attr.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {(form.getValues("attributes") || []).map((attrId) => {
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
                              const newAttributes = (
                                form.getValues("attributes") || []
                              ).filter((id) => id !== attr.id);
                              field.onChange(newAttributes);
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
              </FormControl>
              <ReactHookFormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}
        <Button
          type="submit"
          variant={"default"}
          className=" mt-auto"
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
