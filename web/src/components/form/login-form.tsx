"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authLoginAction } from "@/app/data-access-layer/auth/actions";
import { useRouter } from "@/i18n/navigation";
import { Label } from "@/components/ui/label";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";

export default function LoginForm() {
  const router = useRouter();

  const t = useTranslations("auth.sign-in");

  const [formState, setFormState] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await authLoginAction(formState);
      if (!result.success) {
        setFieldErrors(
          result.fieldErrors
            ? new Map(Object.entries(result.fieldErrors))
            : undefined,
        );
        setErrorMessage(result.message);
      } else {
        setFieldErrors(undefined);
        setErrorMessage(undefined);
        toast.success(t("messages.success"));
        router.replace("/");
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto mt-10 flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate();
            }}
            className="flex flex-col gap-y-8 p-4"
          >
            {[
              {
                label: t("form.email"),
                name: "email",
                type: "email",
                required: true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({
                    ...prev,
                    email: e.target.value,
                  })),
              },
              {
                label: t("form.password"),
                name: "password",
                type: "password",
                required: true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({
                    ...prev,
                    password: e.target.value,
                  })),
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-y-1">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  onChange={field.onChange}
                />
                <FormFieldErrorMessage
                  fieldName={field.name}
                  fieldErrors={fieldErrors}
                />
              </div>
            ))}

            {errorMessage && (
              <p className="text-destructive text-sm">{errorMessage}</p>
            )}
            <Button
              className="w-full"
              type="submit"
              disabled={isPending || !formState.email || !formState.password}
            >
              {isPending ? t("form.loading") : t("form.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
