"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authRegisterAction } from "@/app/data-access-layer/auth/actions";
import { useRouter } from "@/i18n/navigation";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const t = useTranslations("auth.register");

  const [formState, setFormState] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await authRegisterAction(formState);
      if (!res.success) {
        setFieldErrors(
          res.fieldErrors
            ? new Map(Object.entries(res.fieldErrors))
            : undefined,
        );
        setErrorMessage(res.message);
      } else {
        setFieldErrors(undefined);
        setErrorMessage(undefined);
        toast.success(t("messages.success"));
        router.replace("/");
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
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
              name: "firstName",
              label: t("form.firstName"),
              type: "text",
              required: true,
            },
            {
              name: "lastName",
              label: t("form.lastName"),
              type: "text",
              required: true,
            },
            {
              name: "email",
              label: t("form.email"),
              type: "email",
              required: true,
            },
            {
              name: "password",
              label: t("form.password"),
              type: "password",
              required: true,
            },
            {
              name: "confirmPassword",
              label: t("form.confirmPassword"),
              type: "password",
              required: true,
            },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-y-1">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
              />
              <FormFieldErrorMessage
                fieldErrors={fieldErrors}
                fieldName={field.name}
              />
            </div>
          ))}
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? t("form.loading") : t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
