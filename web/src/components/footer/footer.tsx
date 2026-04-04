"use client";

import LocaleSwitcher from "../locale-switcher";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full flex justify-center bg-primary">
      <div className="w-full max-width-container px-4 py-6 relative flex flex-col gap-y-4 items-center">
        <p className="text-center text-sm text-primary-foreground font-medium">
          {t("copyright")}
        </p>
        <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 text-sm flex items-center gap-2">
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
