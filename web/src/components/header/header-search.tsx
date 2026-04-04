"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import { Label } from "../ui/label";

export function HeaderSearch() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchValue(q);
    }
  }, [searchParams]);

  const t = useTranslations("header");

  return (
    <form
      className="flex flex-col gap-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (searchValue.trim().length > 0) {
          searchParams.append("q", searchValue.trim());
          router.push(`/search?${searchParams.toString()}`);
        }
      }}
    >
      <Label className="block sm:hidden" htmlFor="headerSearch">
        {t("searchLabel")}
      </Label>
      <div className="flex gap-x-0.5">
        <Input
          id="headerSearch"
          placeholder={t("search")}
          className="w-full max-w-[360px] text-sm placeholder:text-sm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button size={"icon"} variant={"outline"} type="submit">
          <SearchIcon className="size-4 text-accent-foreground" />
        </Button>
      </div>
    </form>
  );
}
