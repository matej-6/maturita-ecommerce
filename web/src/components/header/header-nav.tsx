"use client";

import { Input } from "../ui/input";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenu,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { useTranslations } from "next-intl";
import { FragmentType, getFragmentData, graphql } from "@/graphql";
import { getCategoryLink } from "@/app/lib/navigation";
import { use } from "react";
import { ExecutionResult } from "graphql";
import { Link } from "@/i18n/navigation";

const HeaderNav_QueryFragment = graphql(`
  fragment HeaderNav_QueryFragment on Query {
    categories(parentId: "") {
      id
      name
      description
      slug
      subcategories {
        id
        slug
        name
      }
    }
  }
`);

type HeaderNavProps = {
  queryPromise: Promise<
    ExecutionResult<FragmentType<typeof HeaderNav_QueryFragment>>
  >;
};

export function HeaderNav({ queryPromise }: HeaderNavProps) {
  const query = use(queryPromise);
  const data = getFragmentData(HeaderNav_QueryFragment, query.data);
  const t = useTranslations("header");

  return (
    <nav className="flex items-center">
      <div className="relative mx-auto">
        <div className="absolute -left-2 -translate-x-[100%] top-1/2 -translate-y-1/2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  disabled={!data}
                  className="text-sm font-secondary"
                >
                  {t("browse-categories")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 w-[800px] grid-cols-3">
                    {data?.categories.map((category) => (
                      <NavigationMenuLink key={category.id} asChild>
                        <div className="flex flex-col gap-4">
                          <Link
                            className="flex flex-col gap-2 group"
                            href={getCategoryLink(category.slug)}
                          >
                            <h3 className="text-lg font-secondary group-hover:underline leading-none font-medium">
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

        <Input
          placeholder={t("search")}
          className="w-full max-w-[360px] text-sm font-secondary placeholder:text-sm placeholder:font-secondary"
        />
      </div>
    </nav>
  );
}
