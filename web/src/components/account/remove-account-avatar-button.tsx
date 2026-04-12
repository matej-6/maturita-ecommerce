"use client";

import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { removeUserAvatarAction } from "@/app/data-access-layer/user/actions";
import { toast } from "sonner";
import { ResponsiveButton } from "../responsive-button";

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
      variant={"default"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      {t("removeAvatar")}
    </ResponsiveButton>
  );
}
