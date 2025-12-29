"use client";

import { Button } from "../ui/button";
import { MenuIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Role } from "@/graphql/graphql";
// import { getCurrentSessionOrAuthenticate } from "@/app/data-access-layer/auth/queries";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { authLogoutAction } from "@/app/data-access-layer/auth/actions";
import { useSession } from "@/lib/tanstack-query/queries";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "../cart";

export function HeaderRightNav() {
  const { data: currentSession } = useSession();

  const t = useTranslations("header");

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await authLogoutAction();
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
                  <NavigationMenuContent>
                    <ul className="grid w-44 gap-4">
                      <li>
                        {currentSession.role === Role.Admin && (
                          <NavigationMenuLink asChild>
                            <Link href="/admin">{t("admin-dashboard")}</Link>
                          </NavigationMenuLink>
                        )}
                        <NavigationMenuLink asChild>
                          <Link href="/account-details">
                            {t("account-details")}
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Button
                            disabled={isLoggingOut}
                            onClick={() => logout()}
                            variant={"ghost"}
                            size={"sm"}
                            className="text-sm w-full items-start font-normal hover:cursor-pointer"
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <ShoppingCartIcon className="size-6 text-secondary-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent className="min-w-full xs:min-w-[400px] grow flex flex-col z-[999]">
                <SheetHeader>
                  <SheetTitle>Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-4 m-2 grow flex">
                  <Cart />
                </div>
              </SheetContent>
            </Sheet>
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
      </div>
    </>
  );
}
