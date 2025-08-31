"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenu,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import Link from "next/link";
import { useTranslations } from "next-intl";

type NavCategory = {
  id: string;
  name: string;
  description?: string;
  link: string;
  subcategories: NavCategory[];
};

type HeaderNavProps = {
  categories: NavCategory[];
};

export function HeaderNav({ categories }: HeaderNavProps) {
  const t = useTranslations("header");

  return (
    <nav className="flex items-center">
      <div className="relative mx-auto">
        <div className="absolute -left-2 -translate-x-[100%] top-1/2 -translate-y-1/2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-secondary">
                  {t("browse-categories")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <NavigationMenuLink asChild key={category.id}>
                        <Link href={category.link}>{category.name}</Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Input
          placeholder={t("search")}
          className="w-full max-w-[360px] text-sm font-secondary placeholder:text-sm placeholder:font-secondary"
        />
      </div>
    </nav>
  );
}
