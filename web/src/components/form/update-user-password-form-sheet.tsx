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

export function UpdateUserPasswordFormSheet() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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
      }
    },
  });

  const t = useTranslations("accountDetailsPage");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton variant="secondary">
          {t("buttons.changePassword")}
        </ResponsiveButton>
      </SheetTrigger>

      <SheetContent className="grow">
        <SheetHeader>
          <SheetTitle>Change Password</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-3 sm:gap-y-6 px-4 grow"
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="currentPassword">Current Password</Label>
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
            <Label htmlFor="newPassword">New Password</Label>
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
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <SheetClose asChild>
              <Button variant={"outline"}>Close</Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
