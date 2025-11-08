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
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ContinueWithGoogleLightButton } from "@/components/buttons/continue-with-google-light-button";
import { useTranslations } from "next-intl";
import {
  authLoginAction,
  getCurrentSessionAction,
} from "@/app/data-access-layer/auth/actions";
import { createLoginSchema, loginSchemaType } from "./login-schema";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/lib/tanstack-query/queries";
import { getQueryClient } from "@/lib/get-query-client";
import { SESSION_QUERY_KEY } from "@/lib/tanstack-query/query-keys";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session !== null) {
      router.replace("/");
    }
  }, [session, router]);

  const t = useTranslations("auth.sign-in"); // translations for this page
  const ft = useTranslations("form"); // general form translations (napr. invalidEmail, invalidPassword ...)

  const loginSchema = createLoginSchema(ft);

  const queryClient = getQueryClient();

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
      const session = await getCurrentSessionAction();
      queryClient.setQueryData(
        SESSION_QUERY_KEY,
        session === null
          ? null
          : {
              ...session,
              __fromServer: false,
            }
      );
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
              className="space-y-8"
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
                className="w-full"
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? t("form.loading") : t("form.submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
