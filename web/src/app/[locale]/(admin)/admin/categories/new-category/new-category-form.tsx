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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";

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

  const [fieldErrors, setFieldErrors] = useState(new Map<string, string[]>());
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
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
              <FormMessage />
              {(fieldErrors.get("slug") || []).map((error, index) => (
                <p key={index} className="text-red-500">
                  {error}
                </p>
              ))}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
