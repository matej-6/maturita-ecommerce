"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Fragment, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbsProps = {
  defaultBreadcrumb: { label: string; href: string };
};

export function Breadcrumbs({defaultBreadcrumb}: BreadcrumbsProps) {
  const pathname = usePathname();

  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href: string }[]
  >([
    defaultBreadcrumb
  ]);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Dashboard",
        href: "/admin",
      },
      ...pathname
        .split("/")
        .slice(2) // ak je pathname: '/admin', tak pathname.split('/') je ['', 'admin'], preto slice(2) a nie slice(1)
        .map((b, index) => ({
          label: b
            .split("-") // napriklad new-category -> New Category
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          href: pathname
            .split("/")
            .slice(0, index + 3) // index + 3 lebo slice(2), ak by bol slice(1), tak by bol index + 2, ak by bol slice(0), tak by bol index + 1
            .join("/"),
        })),
    ]);
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.length > 3 ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href={breadcrumbs[0].href}>{breadcrumbs[0].label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href={breadcrumbs[breadcrumbs.length - 2].href}>
                  {breadcrumbs[breadcrumbs.length - 2].label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        ) : (
          breadcrumbs.slice(0, breadcrumbs.length - 1).map((b, i) => (
            <Fragment key={i}>
              <BreadcrumbItem className={"hidden md:block"}>
                <BreadcrumbLink asChild>
                  <Link href={b.href}>{b.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </Fragment>
          ))
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {breadcrumbs[breadcrumbs.length - 1].label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
