"use client";

import { CurrentSession } from "@/app/data-access-layer/auth/queries";
import { Avatar } from "@/components/account/avatar";
// https://ui.shadcn.com/blocks/sidebar#sidebar-08

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/navigation";
import { ChevronsUpDownIcon, HomeIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { use } from "react";

type SidebarUserProps = {
  currentSessionPromise: Promise<CurrentSession | null>;
};

export function SidebarUser({ currentSessionPromise }: SidebarUserProps) {
  const t = useTranslations("admin.sidebar");

  const isMobile = useIsMobile();
  const session = use(currentSessionPromise);
  if (!session) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={"lg"}
              className="data-[state=open]:bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <Avatar size="sm" session={session} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session.firstName} {session.lastName}
                </span>
                <span className="truncate text-xs">{session.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={2}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar size="sm" session={session} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session.firstName} {session.lastName}
                  </span>
                  <span className="truncate text-xs">{session.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/account-details">
              <DropdownMenuItem>
                <UserIcon />
                {t("account.account")}
              </DropdownMenuItem>
            </Link>
            <Link href="/">
              <DropdownMenuItem>
                <HomeIcon />
                {t("account.exit")}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
