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
} from "lucide-react";

// https://ui.shadcn.com/blocks/sidebar#sidebar-08

const generalNavItems = [
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers2Icon,
  },

  {
    label: "Locales",
    href: "/admin/locales",
    icon: LanguagesIcon,
  },
];

const storeNavItems = [
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

export function AdminSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={"lg"} asChild>
              <Link href="/admin">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium text-xl">Grably s.r.o.</span>
                  <span className="text-xs truncate font-secondary">
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
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon /> <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Store</SidebarGroupLabel>
          <SidebarMenu>
            {storeNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon /> <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
