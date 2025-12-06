"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CategoryTranslationForm,
  CategoryTranslationFormProps,
} from "../../forms/category-translation-form";
import { useMutation } from "@tanstack/react-query";
import { deleteCategoryTranslationAction } from "@/app/data-access-layer/admin/category-translation/actions";
import { useState } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { toast } from "sonner";

type CategoryTranslationProps = {
  translationId: number;
  refetchKey?: unknown[];
  formProps: CategoryTranslationFormProps;
  locale: {
    code: string;
    name: string;
    flag: string;
  };
  name: string;
  description?: string;
};

export function CategoryTranslation({
  formProps,
  locale,
  refetchKey,
  translationId,
  name,
  description,
}: CategoryTranslationProps) {
  const queryClient = getQueryClient();

  const { mutate: deleteTranslation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!confirmation) {
        setConfirmation(true);
        setTimeout(() => {
          setConfirmation(false);
        }, 3000);
        return;
      }
      const res = await deleteCategoryTranslationAction(translationId);
      if (res.success) {
        if (refetchKey) {
          queryClient.refetchQueries({
            queryKey: refetchKey,
            exact: true,
          });
        }
      } else {
        toast.error(res.message);
      }
    },
  });

  const [confirmation, setConfirmation] = useState(false);

  return (
    <Card className="w-lg" key={locale.code}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {`${locale?.name} ${locale?.flag}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-auto">
        <div>
          <span className="text-muted-foreground text-xs">Name</span>
          <p>{name}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">Description</span>
          <p>{description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-x-2 justify-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button>Edit</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add translation</SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4">
                  <CategoryTranslationForm {...formProps} />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
          <Button
            disabled={isDeleting}
            onClick={() => deleteTranslation()}
            variant={confirmation ? "destructive" : "secondary"}
          >
            {confirmation ? "Are you sure?" : "Delete"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
