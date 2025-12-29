"use client";

import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { updateUserPasswordAction } from "@/app/data-access-layer/user/actions";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";
import { ResponsiveButton } from "../responsive-button";
import { toast } from "sonner";

export function UpdateUserPasswordFormSheet() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const t = useTranslations("accountDetailsPage");

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await updateUserPasswordAction(formData);
      if (!result.success) {
        const fieldErrorsMap = new Map();
        result.fieldErrors?.forEach((e) =>
          fieldErrorsMap.set(e.property, e.constraints)
        );
        setFieldErrors(fieldErrorsMap);
        setErrorMessage(result.message);
      } else {
        setFieldErrors(undefined);
        setErrorMessage(undefined);
        toast.success(t("changePasswordForm.successToast"));
      }
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton variant="secondary">
          {t("buttons.changePassword")}
        </ResponsiveButton>
      </SheetTrigger>

      <SheetContent className="grow">
        <SheetHeader>
          <SheetTitle>{t("changePasswordForm.title")}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-3 sm:gap-y-6 px-4 grow"
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="currentPassword">
              {t("changePasswordForm.currentPassword")}
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handlechange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="currentPassword"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="newPassword">
              {t("changePasswordForm.newPassword")}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handlechange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="newPassword"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="confirmNewPassword">
              {t("changePasswordForm.confirmNewPassword")}
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handlechange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="confirmNewPassword"
            />
          </div>
          <p className="text-red-600">{errorMessage}</p>
          <div className="flex flex-col gap-y-2 mt-auto pb-4">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("changePasswordForm.loadingButton")
                : t("changePasswordForm.submitButton")}
            </Button>
            <SheetClose asChild>
              <Button variant={"outline"}>
                {t("changePasswordForm.closeButton")}
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
