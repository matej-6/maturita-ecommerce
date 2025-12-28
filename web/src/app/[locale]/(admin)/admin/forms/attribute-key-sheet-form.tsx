"use client";

import {
  createAttributeKeyAction,
  updateAttributeKeyAction,
} from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { FormFieldErrorMessage } from "@/components/form/formFieldErrorMessage";
import { ResponsiveButton } from "@/components/responsive-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  initialData?: FormData & {
    id: number;
  };
};

type FormData = {
  key: string;
};

export function AttributeSheetForm({ initialData }: Props) {
  const [formData, setFormData] = useState<FormData>({
    key: initialData?.key || "",
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
      let result;
      if (!initialData) {
        result = await createAttributeKeyAction({
          key: formData.key,
        });
      } else {
        result = await updateAttributeKeyAction(initialData.id, {
          key: formData.key,
        });
      }
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton variant="secondary">
          {initialData ? "Edit Attribute" : "Add Attribute"}
        </ResponsiveButton>
      </SheetTrigger>

      <SheetContent className="grow">
        <SheetHeader>
          <SheetTitle>
            {initialData ? "Edit Attribute Key" : "Add Attribute Key"}
          </SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-3 sm:gap-y-6 px-4 grow"
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              type="text"
              value={formData.key}
              onChange={handlechange}
            />
            <FormFieldErrorMessage fieldErrors={fieldErrors} fieldName="key" />
          </div>

          <p className="text-red-600">{errorMessage}</p>
          <div className="flex flex-col gap-y-2 mt-auto pb-4">
            <Button type="submit" disabled={isPending}>
              {initialData
                ? isPending
                  ? "Saving..."
                  : "Save Changes"
                : isPending
                ? "Creating..."
                : "Create Attribute"}
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
