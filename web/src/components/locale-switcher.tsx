import { Locale, useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Button, buttonVariants } from "./ui/button";

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();

  const t = useTranslations("localeSwitcher");
  const locale = useLocale();

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(value: string) {
    const nextLoc = value as Locale;
    startTransition(() => {
      //@ts-expect-error funguje
      router.replace({ pathname, params }, { locale: nextLoc });
    });
  }

  return (
    <>
      <p className="sr-only">{t("label")}</p>
      <Select
        defaultValue={locale}
        disabled={isPending}
        onValueChange={onSelectChange}
      >
        <SelectTrigger className={buttonVariants({ variant: "default" })}>
          <SelectValue
            className="text-primary-foreground"
            placeholder={t("label")}
          />
        </SelectTrigger>
        <SelectContent className="w-[200px]">
          {routing.locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {t("locale", { locale: loc })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
