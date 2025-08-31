"use client";

import { useForm } from "react-hook-form";
import { registerSchema } from "./register-schema";
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
import { JsonErrorResponse } from "@/lib/json-error-response";
import { toast } from "sonner";
import { getQueryClient } from "@/providers/queryProvider";
import { CURRENT_SESSION_QUERY_KEY } from "@/queries/current-session-query-options";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const form = useForm<z.infer<typeof registerSchema>>({
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

  const [fieldErrors, setFieldErrors] = useState(new Map<string, string[]>());
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);

  const queryClient = getQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/register`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const errorResponse = JsonErrorResponse.fromError(await res.json());
        setGlobalErrors(errorResponse.getMessages());
        setFieldErrors(errorResponse.getFieldValidationErrors());
        throw new Error();
      }
    },

    onSuccess: async () => {
      toast.success("Account created successfully.");
      await queryClient.invalidateQueries({
        queryKey: CURRENT_SESSION_QUERY_KEY,
      });

      router.replace("/");
    },
  });

  const t = useTranslations("auth.register");

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              await mutate(data);
            })}
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
                  <FormMessage />
                  <CustomFieldError
                    errors={fieldErrors.get("firstName") || []}
                  />
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
                  <FormMessage />
                  <CustomFieldError
                    errors={fieldErrors.get("lastName") || []}
                  />
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
                  <FormMessage />
                  <CustomFieldError errors={fieldErrors.get("email") || []} />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <CustomFieldError
                    errors={fieldErrors.get("confirmPassword") || []}
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
      </CardContent>
    </Card>
  );
}

function CustomFieldError({ errors }: { errors: string[] }) {
  return <p className="text-red-500 text-sm">{errors.join(", ")}</p>;
}
