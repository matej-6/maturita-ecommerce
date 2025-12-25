"use client";

import { useTranslations } from "next-intl";
import { ResponsiveButton } from "./responsive-button";
import { useMutation } from "@tanstack/react-query";
import { removeUserAvatarAction } from "@/app/data-access-layer/user/actions";
import { toast } from "sonner";

export function RemoveAccountAvatarButton() {
  const t = useTranslations("accountDetailsPage.buttons");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await removeUserAvatarAction();
      if (!res.success) {
        throw new Error(res.message || "An unexpected exception ocurred.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <ResponsiveButton
      variant={"secondary"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {t("removeAvatar")}
    </ResponsiveButton>
  );
}
