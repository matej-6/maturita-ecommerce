"use client";

import { useForm } from "react-hook-form";
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
import { getQueryClient } from "@/providers/queryProvider";
import { CURRENT_SESSION_QUERY_KEY } from "@/queries/current-session-query-options";
import { loginSchema } from "./login-schema";
import { ContinueWithGoogleLightButton } from "@/components/buttons/continue-with-google-light-button";
import { useTranslations } from "next-intl";
import { authLoginAction } from "@/app/data-access-layer/auth/actions";

export default function RegisterPage() {
  const t = useTranslations("auth.sign-in"); // translations for this page
  const pft = useTranslations("auth.sign-in.form"); // translations specifically for form in this page (pft = page form translations)
  const ft = useTranslations("form"); // general form translations (napr. invalidEmail, invalidPassword ...)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [fieldErrors, setFieldErrors] = useState(new Map<string, string[]>());
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);

  const queryClient = getQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const result = await authLoginAction(data);
      if (!result.success) {
        setGlobalErrors(result.globalErrors);
        setFieldErrors(result.fieldErrors);
        throw new Error();
      }
    },

    onSuccess: async () => {
      toast.success(t("messages.success"));
      await queryClient.invalidateQueries({
        queryKey: CURRENT_SESSION_QUERY_KEY,
      });

      router.replace("/");
    },
  });

  function FormFieldErrorMessage({
    field,
  }: {
    field: keyof z.infer<typeof loginSchema>;
  }) {
    let message = "";
    if (fieldErrors.has(field) && fieldErrors.get(field)!.length > 0) {
      message = fieldErrors.get(field)!.join(",");
    } else if (form.formState.errors[field]?.message) {
      message = ft(form.formState.errors[field]!.message);
    }

    if (!message) return null;
    return <p className="text-red-500 text-sm">{message}</p>;
  }

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
                    {/* <FormMessage /> */}
                    <FormFieldErrorMessage field="email" />
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
                    <CustomFieldError
                      errors={fieldErrors.get("password") || []}
                    />
                  </FormItem>
                )}
              />
              {globalErrors.length > 0 && (
                <div className="text-red-500 text-sm">
                  {globalErrors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
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

function CustomFieldError({ errors }: { errors: string[] }) {
  return <p className="text-red-500 text-sm">{errors.join(", ")}</p>;
}
