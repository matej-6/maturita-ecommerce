"use client";

import { useForm } from "react-hook-form";
import { createRegisterSchema, registerSchemaType } from "./register-schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authRegisterAction } from "@/app/data-access-layer/auth/actions";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tf = useTranslations("form");

  const registerSchema = createRegisterSchema(tf);

  const form = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const res = await authRegisterAction(data);
      if (!res.success) {
        setFieldErrors(
          res.fieldErrors ? new Map(Object.entries(res.fieldErrors)) : undefined
        );
        setErrorMessage(res.message);
        throw Error();
      }
    },

    onSuccess: async () => {
      toast.success("Account created successfully.");
      router.replace("/");
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => await mutate(data))}
            className="space-y-8 font-secondary"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.firstName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormFieldErrorMessage fieldErrors={fieldErrors} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.lastName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormFieldErrorMessage fieldErrors={fieldErrors} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormFieldErrorMessage fieldErrors={fieldErrors} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormFieldErrorMessage fieldErrors={fieldErrors} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
              disabled={isPending || !form.formState.isValid}
            >
              {isPending ? t("form.loading") : t("form.submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
