"use server";

import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import Link from "next/link";
import { HeaderRightNav } from "./header-right-nav";
import { HeaderNav } from "./header-nav";
import { getLocale } from "next-intl/server";
import { Suspense } from "react";

const CategoryFields = graphql(`
  fragment CategoryFields on Category {
    id
    slug
    parentCategoryId
    translations(locale: $locale) {
      id
      name
      description
    }
  }
`);

const CategoryWithChildrenFields = graphql(`
  fragment CategoryWithChildrenFields on Category {
    ...CategoryFields
    subcategories {
      ...CategoryFields
    }
  }
`);

const CategoriesQuery = graphql(`
  query AllCategories($locale: String) {
    categories(withParentId: null, locale: $locale) {
      ...CategoryWithChildrenFields
    }
  }
`);

export async function Header() {
  const locale = await getLocale();

  const res = await execute({}, CategoriesQuery, { locale: locale });

  return (
    <header className="w-full border-b-2">
      <div className="max-width-container grid grid-cols-5 items-center py-4 gap-4">
        <div className="col-span-1 flex justify-start">
          <Link
            href="/"
            className="font-primary font-light text-3xl md:text-3xl"
          >
            GRABLY
          </Link>
        </div>
        <div className="col-span-3 flex justify-center">
          <div className="hidden sm:block">
            <Suspense>
              <HeaderNav
                categories={
                  res.data?.categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                    subcategories: c.subcategories.map((s) => ({
                      id: s.id,
                      name: s.name,
                      link: `/categories/${c.slug}/${s.slug}`,
                      subcategories: [],
                    })),
                    description: c.description ?? undefined,
                    link: `/categories/${c.slug}`,
                  })) ?? []
                }
              />
            </Suspense>
          </div>
        </div>
        <div className="col-span-1 flex justify-end items-center">
          <HeaderRightNav />
        </div>
      </div>
    </header>
  );
}
