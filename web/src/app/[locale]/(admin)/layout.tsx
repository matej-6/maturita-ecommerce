"use client";

import { Role } from "@/graphql/graphql";
import { useRouter } from "@/i18n/navigation";

import { useSession } from "@/providers/queryProvider";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isError, isPending } = useSession();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isPending && (session?.role !== Role.Admin || isError)) {
      router.push("/auth/login", { locale: locale });
    }
  }, [session, isError, router, locale, isPending]);

  if (!session) return null;

  return <>{children}</>;
}
