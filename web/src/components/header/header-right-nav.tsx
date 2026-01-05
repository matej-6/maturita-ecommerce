"use client";

import { Button, buttonVariants } from "../ui/button";
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
import { Avatar } from "../avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

export function HeaderRightNav({
  categories,
}: {
  categories: {
    id: number;
    name: string;
    slug: string;
    subcategories: { id: number; name: string; slug: string }[];
  }[];
}) {
  const { data: currentSession } = useSession();

  const t = useTranslations("header");

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await authLogoutAction();
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="sm:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon className="size-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>GoFitShop</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                  {currentSession ? (
                    <>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button>{t("cart")}</Button>
                        </SheetTrigger>
                        <SheetContent className="min-w-full xs:min-w-[400px] grow flex flex-col z-[999]">
                          <SheetHeader>
                            <SheetTitle>{t("cart")}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-4 m-2 grow flex">
                            <Cart />
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        asChild
                        className="text-sm"
                      >
                        <Link href="/account-details">
                          {t("account-details")}
                        </Link>
                      </Button>
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        className="text-sm"
                      >
                        <span onClick={() => logout()} className="w-full">
                          {isLoggingOut ? t("logging-out") : t("logout")}
                        </span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        asChild
                        className="text-sm"
                      >
                        <Link href="/auth/login">{t("login")}</Link>
                      </Button>
                      <Button
                        variant={"default"}
                        size={"sm"}
                        asChild
                        className="text-sm"
                      >
                        <Link href="/auth/register">{t("register")}</Link>
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <h2>{t("browse-categories")}</h2>
                  {categories.map((category) => (
                    <div key={category.id} className="flex flex-col gap-y-1">
                      <Link
                        href={`/category/${category.slug}`}
                        className={buttonVariants({ variant: "link" })}
                      >
                        {category.name}
                      </Link>
                      <div className="ml-4 flex flex-col gap-y-0.5">
                        {category.subcategories.map((subcategory) => (
                          <Link
                            className={buttonVariants({ variant: "link" })}
                            key={subcategory.id}
                            href={`/category/${subcategory.slug}`}
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
      <div className="hidden sm:flex items-center gap-2">
        {currentSession ? (
          <div className="flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex gap-x-2 w-fit">
                    <Avatar size="sm" />
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
                  <ShoppingCartIcon className="size-6 text-secondary-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent className="min-w-full xs:min-w-[400px] grow flex flex-col z-[999]">
                <SheetHeader>
                  <SheetTitle>{t("cart")}</SheetTitle>
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
