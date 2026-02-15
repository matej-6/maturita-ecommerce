"use client";

import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenu,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { useTranslations } from "next-intl";
import { getCategoryLink } from "@/app/lib/navigation";
import { Link } from "@/i18n/navigation";
import { HeaderSearch } from "./header-search";

type HeaderNavProps = {
  categories: {
    id: number;
    name: string;
    description: string;
    slug: string;
    subcategories: {
      id: number;
      slug: string;
      name: string;
    }[];
  }[];
};

export function HeaderNav({ categories }: HeaderNavProps) {
  const t = useTranslations("header");

  return (
    <nav className="flex items-center z-50">
      <div className="relative mx-auto">
        <div className="absolute -left-2 -translate-x-[100%] top-1/2 -translate-y-1/2 z-50">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  disabled={categories.length === 0}
                  className="text-sm"
                >
                  {t("browse-categories")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-2 min-w-[600px] z-50">
                    {categories.map((category) => (
                      <NavigationMenuLink key={category.id} asChild>
                        <div className="flex flex-col gap-2 w-[300px]">
                          <Link
                            className="flex flex-col gap-2 group"
                            href={getCategoryLink(category.slug)}
                          >
                            <h3 className="text-lg group-hover:underline leading-none font-medium">
                              {category.name}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-snug line-clamp-4">
                              {category.description}
                            </p>
                          </Link>
                          <span className="sr-only">Subcategories:</span>
                          <div className="flex flex-col gap-2 justify-start items-start">
                            {category.subcategories
                              .slice(0, 5)
                              .map((subcategory) => (
                                <Link
                                  className="text-base leading-snug hover:underline"
                                  key={subcategory.id}
                                  href={getCategoryLink(subcategory.slug)}
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                          </div>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <HeaderSearch />
      </div>
    </nav>
  );
}
