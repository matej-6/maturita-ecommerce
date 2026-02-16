import { getCurrentSessionAction } from "@/app/data-access-layer/auth/actions";
import { getAccountDetailsPageData } from "@/app/data-access-layer/user.queries";
import { getImageSrc } from "@/app/lib/utils";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { EditUserFormSheet } from "@/components/form/edit-user-form-sheet";
import { UpdateUserPasswordFormSheet } from "@/components/form/update-user-password-form-sheet";
import { OrderStatusLabel } from "@/components/order-status";
import { RemoveAccountAvatarButton } from "@/components/remove-account-avatar-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UpdateAccountAvatarButton } from "@/components/update-account-avatar-button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountDetailsPage() {
  await headers();
  const data = await getAccountDetailsPageData();
  const session = await getCurrentSessionAction();

  if (!session) {
    notFound();
  }

  const t = await getTranslations("accountDetailsPage");

  if (!data.success || !data.data?.me) {
    return (
      <div className="max-width-container mt-6 xl:mt-12">
        <h1 className="text-2xl font-medium">{t("error")}</h1>
      </div>
    );
  }

  const user = data.data.me;

  return (
    <div className="max-width-container py-6 sm:py-12 flex flex-col gap-y-6 sm:gap-y-12">
      <div className="flex flex-col gap-y-3 sm:gap-y-6">
        <h1 className="text-2xl sm:text-4xl font-semibold">{t("title")}</h1>
        <Card className="w-full flex flex-col gap-y-4 sm:gap-y-5 p-3 sm:p-4">
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-xs sm:text-xs leading-[120%] text-muted-foreground">
                {t("nameAndLastName")}
              </span>
              <span className="text-base sm:text-2xl">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <EditUserFormSheet
              initialValues={{
                email: user.email,
                name: user.firstName ?? "",
                lastName: user.lastName ?? "",
              }}
            />
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-xs sm:text-xs leading-[120%] text-muted-foreground">
                {t("email")}
              </span>
              <span className="text-base sm:text-2xl">{user.email}</span>
            </div>
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-1">
              <span className="font-mono text-xs sm:text-xs leading-[120%] text-muted-foreground">
                {t("avatar")}
              </span>
              <UpdateAccountAvatarButton
                firstName={user.firstName || undefined}
                imageUrl={getImageSrc(user.avatarUrl ?? undefined)}
              />
            </div>
            {user.avatarUrl && <RemoveAccountAvatarButton />}
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-xs sm:text-xs leading-[120%] text-muted-foreground">
                {t("password")}
              </span>
              <span className="text-base sm:text-2xl">********</span>
            </div>
            <UpdateUserPasswordFormSheet />
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-xs sm:text-xs leading-[120%] text-muted-foreground">
                {t("updatedAt")}
              </span>
              <span className="text-base sm:text-2xl">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-xs sm:text-xs leading-[120%] text-muted-foreground">
                {t("createdAt")}
              </span>
              <span className="text-base sm:text-2xl">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <DeleteAccountButton />
          </div>
        </Card>
      </div>
      <div className="flex flex-col gap-y-3 sm:gap-y-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          {t("orders.title")}
        </h2>
        <Card className="w-full py-0 overflow-hidden">
          <Table className="w-full">
            <TableHeader className="w-full">
              <TableRow className="w-full *:h-fit p-3 sm:p-4 *:font-mono *:text-muted-foreground *:font-medium *:text-xs *:sm:text-sm grid grid-cols-[1fr_1fr_1fr_1fr_2fr] sm:grid-cols-[1fr_1fr_1fr_1fr_1fr_2fr] items-center">
                <TableHead>{t("orders.id")}</TableHead>
                <TableHead>{t("orders.status")}</TableHead>
                <TableHead>{t("orders.total")}</TableHead>
                <TableHead className="hidden sm:block">
                  {t("orders.items")}
                </TableHead>
                <TableHead>{t("orders.date")}</TableHead>
                <TableHead className="text-right">
                  {t("orders.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="w-full p-3 sm:p-4 *:text-sm *:sm:text-base grid grid-cols-[1fr_1fr_1fr_1fr_2fr] sm:grid-cols-[1fr_1fr_1fr_1fr_1fr_2fr] items-center"
                >
                  <TableCell className="font-mono">{order.id}</TableCell>
                  <TableCell>
                    <OrderStatusLabel status={order.status.toString()} />
                  </TableCell>
                  <TableCell>
                    {(order.totalInCents / 100).toFixed(2)}€
                  </TableCell>
                  <TableCell className="hidden sm:block">
                    {order.items.length}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex justify-end items-center gap-x-2">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button
                        className="block sm:hidden"
                        size={"xs"}
                        variant={"secondary"}
                      >
                        {t("orders.viewOrder")}
                      </Button>
                      <Button
                        className="hidden sm:block"
                        size={"default"}
                        variant={"secondary"}
                      >
                        {t("orders.viewOrder")}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-xs sm:text-sm mb-4">
              {t("orders.tableDescription")}
            </TableCaption>
          </Table>
        </Card>
      </div>
    </div>
  );
}
