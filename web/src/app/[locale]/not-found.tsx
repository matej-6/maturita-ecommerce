"use client";

import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("not-found");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 gap-4">
      <h1 className="text-[14rem] font-mono font-medium text-accent-foreground">
        404
      </h1>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("message")}</p>
      </div>
      <div className="flex items-center gap-x-4">
        <Button
          className="hover:cursor-pointer flex justify-center items-center"
          onClick={() => router.back()}
          size={"sm"}
          variant={"default"}
        >
          <ArrowLeftIcon className="mr-0.5" />
          <span className="mt-0.5">{t("back-button")}</span>
        </Button>
        <Button variant={"outline"} size={"sm"} asChild>
          <Link href="/" className="flex justify-center items-center">
            <HomeIcon className="mr-0.5" />
            <span className="mt-0.5">{t("home-button")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
