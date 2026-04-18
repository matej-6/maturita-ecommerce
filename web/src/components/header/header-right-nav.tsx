"use client";

import { Button } from "../ui/button";
import { LogOutIcon, MenuIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Role } from "@/graphql/graphql";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { authLogoutAction } from "@/app/data-access-layer/auth/actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "../cart/cart";
import { Avatar } from "../account/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { HeaderSearch } from "./header-search";
import { CurrentSession } from "@/app/data-access-layer/auth/queries";

export function HeaderRightNav({
  categories,
  session,
}: {
  categories: {
    id: number;
    name: string;
    slug: string;
    subcategories: { id: number; name: string; slug: string }[];
  }[];
  session: CurrentSession | null;
}) {
  const currentSession = session;
  const t = useTranslations("header");
  const router = useRouter();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await authLogoutAction();
      router.push("/auth/login");
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="lg:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon className="size-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[100vh]! min-h-[80vh]!">
            <div className="mx-auto w-full max-w-sm overflow-y-scroll overflow-x-hidden">
              <DrawerHeader>
                <DrawerTitle>
                  <Link href="/">GoFitShop</Link>
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-4 flex flex-col gap-y-8">
                <div className="flex gap-x-1.5 items-center mx-auto">
                  {currentSession ? (
                    <>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button>
                            {t("cart")} <ShoppingCartIcon className="w-8 h-8" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="min-w-full xs:min-w-[400px] grow flex flex-col z-[999]">
                          <SheetHeader>
                            <SheetTitle>{t("cart")}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-4 m-2 overflow-y-auto">
                            <Cart />
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Link href="/account-details">
                        <Button variant={"outline"}>
                          <UserIcon className="w-8 h-8" />
                        </Button>
                      </Link>

                      {currentSession.role === Role.Admin && (
                        <Link href="/admin">
                          <Button variant={"outline"}>
                            <span className="text-sm">
                              {t("admin-dashboard")}
                            </span>
                          </Button>
                        </Link>
                      )}
                      <Button variant={"outline"} onClick={() => logout()}>
                        <LogOutIcon className="w-8 h-8" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login">
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className="text-sm"
                        >
                          {t("login")}
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button
                          variant={"default"}
                          size={"sm"}
                          className="text-sm"
                        >
                          {t("register")}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
                <HeaderSearch />
                <div className="flex flex-col gap-y-2">
                  <h2 className="text-center text-sm font-bold">
                    {t("browse-categories")}
                  </h2>
                  {categories.map((category) => (
                    <div key={category.id} className="flex flex-col gap-y-1">
                      <Link
                        href={`/category/${category.slug}`}
                        className={"text-center text-lg hover:underline"}
                      >
                        {category.name}
                      </Link>
                      <div className="flex flex-col gap-y-0.5">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/category/${subcategory.slug}`}
                            className={"text-center hover:underline"}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden lg:flex items-center gap-2">
        {currentSession ? (
          <div className="flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="size-fit! px-2! py-1!">
                    <Avatar session={currentSession} size="sm" />
                  </NavigationMenuTrigger>
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
                  <ShoppingCartIcon className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="min-w-full xs:min-w-[400px] grow flex flex-col z-[999]">
                <SheetHeader>
                  <SheetTitle>{t("cart")}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 m-2 overflow-y-auto">
                  <Cart />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant={"outline"} size={"sm"} className="text-sm">
                {t("login")}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant={"default"} size={"sm"} className="text-sm">
                {t("register")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
