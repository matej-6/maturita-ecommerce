"use server";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { SidebarUser } from "./sidebar-user";
import {
  BadgeEuroIcon,
  KeyIcon,
  LanguagesIcon,
  Layers2Icon,
  ShoppingBagIcon,
  User2Icon,
  UserCog2Icon,
} from "lucide-react";
import { getCurrentSession } from "@/app/data-access-layer/auth/queries";
import { ElementType } from "react";
import { getTranslations } from "next-intl/server";

// https://ui.shadcn.com/blocks/sidebar#sidebar-08

type NavItem = {
  label: string;
  href: string;
  icon: ElementType;
};

export async function AdminSidebar() {
  const currentSessionPromise = getCurrentSession();

  const t = await getTranslations("admin.sidebar");

  const generalNavItems: NavItem[] = [
    {
      label: t("general.categories"),
      href: "/admin/categories",
      icon: Layers2Icon,
    },

    {
      label: t("general.users"),
      href: "/admin/users",
      icon: UserCog2Icon,
    },
    {
      label: t("general.orders"),
      href: "/admin/orders",
      icon: BadgeEuroIcon,
    },
  ];

  const productsNavItems: NavItem[] = [
    {
      label: t("products.products"),
      href: "/admin/products",
      icon: ShoppingBagIcon,
    },
    {
      label: t("products.attributes"),
      href: "/admin/attribute-keys",
      icon: KeyIcon,
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"}>
              <Link href="/admin">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium text-xl font-secondary">
                    GoFitShop
                  </span>
                  <span className="text-xs truncate text-sidebar-foreground/70">
                    {t("dashboard.label")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("general.label")}</SidebarGroupLabel>
          <SidebarMenu>
            {generalNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton tooltip={item.label}>
                    <item.icon /> <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("products.label")}</SidebarGroupLabel>
          <SidebarMenu>
            {productsNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton tooltip={item.label}>
                    <item.icon /> <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser currentSessionPromise={currentSessionPromise} />
      </SidebarFooter>
    </Sidebar>
  );
}
