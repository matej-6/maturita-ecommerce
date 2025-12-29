"use server";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./components/admin-sidebar";
import { Breadcrumbs } from "./components/breadcrumbs";
import { getCurrentSessionAction } from "@/app/data-access-layer/auth/actions";
import { notFound } from "next/navigation";
import { Role } from "@/graphql/graphql";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSessionAction();

  if (session?.role !== Role.Admin) {
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
            <Breadcrumbs
              defaultBreadcrumb={{
                label: "Dashboard",
                href: "/admin",
              }}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
