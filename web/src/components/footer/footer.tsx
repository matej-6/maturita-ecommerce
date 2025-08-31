"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import LocaleSwitcher from "../locale-switcher";
import { useTranslations } from "next-intl";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";

type Theme = "light" | "dark" | "system";

function saveTheme(theme: Theme) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("theme", theme);
  }
}

function loadTheme(): Theme | undefined {
  if (typeof window !== "undefined") {
    const theme = window.localStorage.getItem("theme");
    return theme ? (theme as Theme) : undefined;
  }
}

export function Footer() {
  const t = useTranslations("footer");

  const [theme, setTheme] = useState<Theme>("system");

  const applyTheme = (newTheme: Theme) => {
    const root = window?.document.getElementById("root");
    if (!root) {
      return;
    }
    root.classList.remove("dark");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "system" && mediaQuery.matches) {
      root.classList.add("dark");
    }
  };

  const selectTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (_e: MediaQueryListEvent) => {
      const prevTheme = loadTheme();
      if (prevTheme === "system" || !saveTheme) {
        applyTheme("system");
      }
    };

    const prevTheme = loadTheme();
    if (prevTheme) {
      setTheme(prevTheme);
      applyTheme(prevTheme);
    } else {
      applyTheme("system");
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  return (
    <footer className="w-full max-width-container px-4 py-6 relative flex flex-col gap-y-4 items-center ">
      <p className="text-center font-secondary text-sm text-muted-foreground">
        {t("copyright")}
      </p>
      <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 font-secondary text-sm flex items-center gap-2">
        <LocaleSwitcher />
        <Select
          onValueChange={(v) => selectTheme(v as Theme)}
          defaultValue={theme}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <SunIcon /> {t("dark-mode.light")}
            </SelectItem>
            <SelectItem value="dark">
              <MoonIcon /> {t("dark-mode.dark")}
            </SelectItem>
            <SelectItem value="system">
              <LaptopIcon /> {t("dark-mode.system")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </footer>
  );
}
