"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { MenuIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  CURRENT_SESSION_QUERY_KEY,
  currentSessionQueryOptions,
} from "@/queries/current-session-query-options";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Role } from "@/graphql/graphql";
import { fetchWithRetry } from "@/lib/fetch-with-retry";
import { getQueryClient } from "@/providers/queryProvider";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function HeaderRightNav() {
  const t = useTranslations("header");

  const queryClient = getQueryClient();

  const { data: currentSession, isPending } = useQuery(
    currentSessionQueryOptions
  );

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const res = await fetchWithRetry(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error logging out");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // onSettled: () => {
    //   queryClient.resetQueries({ queryKey: CURRENT_SESSION_QUERY_KEY });
    // },

    onSuccess: () => {
      queryClient.resetQueries({ queryKey: CURRENT_SESSION_QUERY_KEY });
      toast.success("Logged out successfully");
    },
  });

  return (
    <>
      <div className="sm:hidden">
        <Button variant={"ghost"} size={"icon"}>
          <MenuIcon className="size-6" />
        </Button>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        {currentSession ? (
          <div className="flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Button variant={"ghost"} size={"sm"} asChild>
                    <NavigationMenuTrigger>
                      <UserIcon className="size-6 text-secondary-foreground" />
                    </NavigationMenuTrigger>
                  </Button>
                  <NavigationMenuContent className="font-secondary">
                    <ul className="grid w-44 gap-4">
                      <li>
                        {currentSession.role === Role.Admin && (
                          <NavigationMenuLink asChild>
                            <Link href="/admin">{t("admin-dashboard")}</Link>
                          </NavigationMenuLink>
                        )}
                        <NavigationMenuLink asChild>
                          <Link href="/profile">{t("profile")}</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Button
                            disabled={isLoggingOut}
                            onClick={() => logout()}
                            variant={"ghost"}
                            size={"sm"}
                            className="text-sm w-full items-start font-normal"
                          >
                            <span>
                              {isLoggingOut ? t("logging-out") : t("logout")}
                            </span>
                          </Button>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant={"outline"} size={"sm"} asChild className="text-sm">
              <Link href="/auth/login">{t("login")}</Link>
            </Button>
            <Button variant={"default"} size={"sm"} asChild className="text-sm">
              <Link href="/auth/register">{t("register")}</Link>
            </Button>
          </div>
        )}
        <Button variant={"ghost"} size={"icon"}>
          <ShoppingCartIcon className="size-6 text-secondary-foreground" />
        </Button>
      </div>
    </>
  );
}
