"use client";

import { useForm } from "react-hook-form";
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
import { ContinueWithGoogleLightButton } from "@/components/buttons/continue-with-google-light-button";
import { useTranslations } from "next-intl";
import { authLoginAction } from "@/app/data-access-layer/auth/actions";
import { createLoginSchema, loginSchemaType } from "./login-schema";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";

export default function LoginClient() {
  const t = useTranslations("auth.sign-in"); // translations for this page
  const ft = useTranslations("form"); // general form translations (napr. invalidEmail, invalidPassword ...)

  const loginSchema = createLoginSchema(ft);

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
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
    mutationFn: async (data: loginSchemaType) => {
      const result = await authLoginAction(data);
      if (!result.success) {
        setFieldErrors(
          result.fieldErrors
            ? new Map(Object.entries(result.fieldErrors))
            : undefined
        );
        setErrorMessage(result.message);
        throw new Error();
      }
    },

    onSuccess: async () => {
      toast.success(t("messages.success"));
      router.replace("/");
    },
  });

  return (
    <div className="w-full max-w-md mx-auto mt-10 flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => await mutate(data))}
              className="space-y-8 font-secondary"
            >
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
                    <FormMessage />
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
          <div className="h-px bg-muted-foreground rounded-full w-full" />
          <div className="flex justify-center w-full flex-col px-8">
            <ContinueWithGoogleLightButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
