"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { ResponsiveButton } from "./responsive-button";
import { authLogoutAllAction } from "@/app/data-access-layer/auth/actions";
import { useRouter } from "@/i18n/navigation";
import { getQueryClient } from "@/lib/get-query-client";

export function LogoutAllButton() {
  const t = useTranslations("accountDetailsPage");

  const router = useRouter();
  const locale = useLocale();

  const queryClient = getQueryClient();

  const { mutate: logoutAllMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const res = await authLogoutAllAction();
      if (!res.success) {
        throw new Error(res.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push(`/auth/login`, { locale: locale });
    },
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["session"] });
    },
  });

  return (
    <ResponsiveButton
      variant={"outline"}
      disabled={isLoggingOut}
      onClick={() => logoutAllMutation()}
    >
      {t("buttons.logoutAll")}
    </ResponsiveButton>
  );
}
