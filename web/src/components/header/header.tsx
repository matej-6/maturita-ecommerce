"use server";

import Link from "next/link";
import { HeaderRightNav } from "./header-right-nav";
import { HeaderNav } from "./header-nav";
import { Suspense } from "react";
import { getHeaderQueryData } from "@/app/data-access-layer/category.queries";
export async function Header() {
  const headerDataRes = await getHeaderQueryData();

  if (headerDataRes.errors) {
    console.error(headerDataRes.errors);
  }

  const categories = (headerDataRes.data?.categories || []).map((c) => ({
    ...c,
    name: c.name || "",
    subcategories: (c.subcategories || []).map((sc) => ({
      ...sc,
      name: sc.name || "",
    })),
  }));

  return (
    <header className="w-full border-b-2 z-50">
      <div className="max-width-container grid grid-cols-5 items-center py-4 gap-4">
        <div className="col-span-1 flex justify-start">
          <Link
            href="/"
            className="font-secondary font-light text-3xl md:text-3xl"
          >
            GoFitShop
          </Link>
        </div>
        <div className="col-span-3 flex justify-center">
          <div className="hidden lg:block">
            <HeaderNav categories={categories} />
          </div>
        </div>
        <div className="col-span-1 flex justify-end items-center">
          <HeaderRightNav categories={categories} />
        </div>
      </div>
    </header>
  );
}
