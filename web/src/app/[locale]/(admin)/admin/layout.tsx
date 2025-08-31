"use client";

import { Role } from "@/graphql/graphql";
import { useSession } from "@/hooks/use-session";
import { notFound } from "next/navigation";
import { AdminSidebar } from "./components/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, usePathname } from "@/i18n/navigation";
import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const pathname = usePathname();

  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href: string }[]
  >([
    {
      label: "Dashboard",
      href: "/admin",
    },
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

  if (session.isPending) {
    return null;
  }

  if (session.data?.role !== Role.Admin) {
    return notFound();
  }

  return (
    <SidebarProvider className="bg-secondary">
      <AdminSidebar />
      <SidebarInset>
        <header className="flex shrink-0 h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.length > 3 ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumbs[0].href}>
                          {breadcrumbs[0].label}
                        </Link>
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
          </div>
        </header>
        {/*<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>*/}
        <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
