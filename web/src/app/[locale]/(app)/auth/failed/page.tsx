"use client";

import { useRouter } from "@/i18n/navigation";
import { getQueryClient } from "@/lib/get-query-client";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function AuthFailedPage() {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = getQueryClient();

  useEffect(() => {
    queryClient.setQueryData(["session"], null);
    router.replace("/auth/login", { locale: locale });
  }, [router, queryClient, locale]);

  return <h1>failed auth</h1>;
}
