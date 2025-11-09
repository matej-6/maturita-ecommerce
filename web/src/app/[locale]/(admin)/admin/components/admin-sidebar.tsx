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
  LanguagesIcon,
  Layers2Icon,
  ShoppingBagIcon,
  User2Icon,
  UserCog2Icon,
} from "lucide-react";
import { getCurrentSession } from "@/app/data-access-layer/auth/queries";
import { ElementType } from "react";

// https://ui.shadcn.com/blocks/sidebar#sidebar-08

type NavItem = {
  label: string;
  href: string;
  icon: ElementType;
};

const generalNavItems: NavItem[] = [
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers2Icon,
  },

  {
    label: "Users",
    href: "/admin/users",
    icon: UserCog2Icon,
  },
];

const storeNavItems: NavItem[] = [
  {
    label: "Products",
    href: "/admin/products",
    icon: ShoppingBagIcon,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: BadgeEuroIcon,
  },
];

export async function AdminSidebar() {
  const currentSessionPromise = getCurrentSession();

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
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
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
          <SidebarGroupLabel>Store</SidebarGroupLabel>
          <SidebarMenu>
            {storeNavItems.map((item) => (
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
