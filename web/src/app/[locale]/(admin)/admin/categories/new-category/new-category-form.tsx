"use client";

import { useForm } from "react-hook-form";
import { newCategoryFormSchema } from "./new-category-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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

type NewCategoryFormProps = {
  localesPromise: Promise<{ code: string; title: string }[]>;
};

export const NewCategoryForm = ({ localesPromise }: NewCategoryFormProps) => {
  const locales = use(localesPromise);

  const form = useForm<z.infer<typeof newCategoryFormSchema>>({
    resolver: zodResolver(newCategoryFormSchema),
    mode: "all",
  });

  const { mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof newCategoryFormSchema>) => {
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
        className="space-y-8 font-secondary"
      >
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentCategoryId" //toto dokoncit
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormFieldErrorMessage fieldErrors={fieldErrors} />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
