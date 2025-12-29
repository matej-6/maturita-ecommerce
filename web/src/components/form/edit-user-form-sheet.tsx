"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { updateUserAction } from "@/app/data-access-layer/user/actions";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";
import { ResponsiveButton } from "../responsive-button";
import { toast } from "sonner";

type Props = {
  initialValues: EditUserFormData;
};

type EditUserFormData = {
  email: string;
  name: string;
  lastName: string;
};

export function EditUserFormSheet({ initialValues }: Props) {
  const [formData, setFormData] = useState(initialValues);

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const t = useTranslations("accountDetailsPage");

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await updateUserAction(formData);
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
        toast.success(t("editAccountDetailsForm.successToast"));
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton variant="secondary">
          {t("buttons.updateDetails")}
        </ResponsiveButton>
      </SheetTrigger>

      <SheetContent className="grow">
        <SheetHeader>
          <SheetTitle>{t("editAccountDetailsForm.title")}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-3 sm:gap-y-6 px-4 grow"
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="email">{t("editAccountDetailsForm.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="email"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="name">
              {t("editAccountDetailsForm.firstName")}
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <FormFieldErrorMessage fieldErrors={fieldErrors} fieldName="name" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="lastName">
              {t("editAccountDetailsForm.lastName")}
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="lastName"
            />
          </div>
          <p className="text-red-600">{errorMessage}</p>
          <div className="flex flex-col gap-y-2 mt-auto pb-4">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("editAccountDetailsForm.loadingButton")
                : t("editAccountDetailsForm.submitButton")}
            </Button>
            <SheetClose asChild>
              <Button variant={"outline"}>
                {t("editAccountDetailsForm.closeButton")}
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
