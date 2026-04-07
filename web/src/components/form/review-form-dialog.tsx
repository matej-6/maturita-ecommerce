"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation } from "@tanstack/react-query";
import {
  createProductReview,
  updateProductReview,
} from "@/app/data-access-layer/product/mutations";
import { Textarea } from "../ui/textarea";
import { FormFieldErrorMessage } from "./formFieldErrorMessage";
import { useTranslations } from "next-intl";

type ReviewFormDialogProps = {
  disabled?: boolean;
  orderId: number;
  locales: {
    code: string;
    name: string;
  }[];
} & (
  | {
      mode: "create";
      orderItemId: number;
    }
  | {
      mode: "update";
      reviewId: number;
      initialValues: {
        comment: string;
        rating: number;
        lang: string;
      };
    }
);

export default function ReviewFormDialog(props: ReviewFormDialogProps) {
  const t = useTranslations("reviewFormDialog");

  const locales = props.locales;

  const [formState, setFormState] = useState(
    props.mode === "update"
      ? props.initialValues
      : { comment: "", rating: 5, lang: locales[0]?.code ?? "en" },
  );

  const [open, setOpen] = useState(false);

  const isChanged =
    props.mode === "create" ||
    formState.comment !== props.initialValues.comment ||
    formState.rating !== props.initialValues.rating ||
    formState.lang !== props.initialValues.lang;

  const [fieldErrors, setFieldErrors] = useState<
    Map<string, string[]> | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res =
        props.mode === "create"
          ? await createProductReview({
              lang: formState.lang,
              orderItemId: props.orderItemId,
              rating: formState.rating,
              comment: formState.comment || null,
              orderId: props.orderId,
            })
          : await updateProductReview({
              lang: formState.lang,
              reviewId: props.reviewId,
              rating: formState.rating,
              comment: formState.comment || null,
              orderId: props.orderId,
            });
      if (!res.success) {
        const fieldErrorsMap = new Map();
        res.fieldErrors?.forEach((e) =>
          fieldErrorsMap.set(e.property, e.constraints),
        );
        setFieldErrors(fieldErrorsMap);
        setErrorMessage(res.message);
      } else {
        setFieldErrors(undefined);
        setErrorMessage(undefined);
        setOpen(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full"
          size={"sm"}
          disabled={props.disabled}
        >
          {props.mode === "create"
            ? t("triggerButtonCreate")
            : t("triggerButtonUpdate")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? t("titleCreate") : t("titleUpdate")}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-8"
        >
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="comment">{t("commentLabel")}</Label>
            <Textarea
              id="comment"
              placeholder={t("commentPlaceholder")}
              minLength={1}
              maxLength={1000}
              value={formState.comment ?? ""}
              onChange={(e) =>
                setFormState({ ...formState, comment: e.target.value })
              }
              rows={4}
            />
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="comment"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label>{t("ratingLabel")}</Label>
            <div className="flex items-center justify-start gap-x-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <StarIcon
                  key={v}
                  className={cn("size-6 cursor-pointer", {
                    "fill-amber-300 stroke-amber-300": v <= formState.rating,
                  })}
                  onClick={() => {
                    setFormState((prev) => ({
                      ...prev,
                      rating: v,
                    }));
                  }}
                />
              ))}
            </div>
            <FormFieldErrorMessage
              fieldErrors={fieldErrors}
              fieldName="rating"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="lang">{t("languageLabel")}</Label>
            <Select
              value={formState.lang}
              onValueChange={(value) =>
                setFormState({ ...formState, lang: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("languagePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {locales.map((locale) => (
                    <SelectItem key={locale.code} value={locale.code}>
                      {locale.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormFieldErrorMessage fieldErrors={fieldErrors} fieldName="lang" />
          </div>
          <p className="text-red-600">{errorMessage}</p>
          <div className="flex items-center justify-end gap-x-2">
            <DialogClose asChild>
              <Button variant="outline">{t("cancelButton")}</Button>
            </DialogClose>
            <Button type="submit" disabled={!isChanged || isPending}>
              {isPending
                ? t("submittingButton")
                : props.mode === "create"
                  ? t("submitButtonCreate")
                  : t("submitButtonUpdate")}
            </Button>
          </div>
        </form>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
