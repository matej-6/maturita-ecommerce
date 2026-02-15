"use client";

import { useMutation } from "@tanstack/react-query";
import { buttonVariants } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUserAccountAction } from "@/app/data-access-layer/user/actions";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ResponsiveButton } from "./responsive-button";

export function DeleteAccountButton() {
  const router = useRouter();

  const t = useTranslations("accountDetailsPage");

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await deleteUserAccountAction();
      if (!res.success) {
        throw new Error(res.message ?? "Failed to delete account.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <ResponsiveButton variant={"destructive"}>
            {t("buttons.deleteAccount")}
          </ResponsiveButton>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAccountModal.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAccountModal.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("deleteAccountModal.cancelButton")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccount()}
              className={buttonVariants({ variant: "destructive" })}
              disabled={isDeleting}
            >
              {t("deleteAccountModal.deleteButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
