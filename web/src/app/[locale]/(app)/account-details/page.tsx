"use server";

import { getCurrentSessionAction } from "@/app/data-access-layer/auth/actions";
import { getAccountDetailsPageData } from "@/app/data-access-layer/user.queries";
import { getImageSrc } from "@/app/lib/utils";
import { OrderStatusLabel } from "@/components/order-status";
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
import { OrderStatus } from "@/graphql/graphql";
import { notFound } from "next/navigation";

export default async function AccountDetailsPage() {
  const data = await getAccountDetailsPageData();
  const session = await getCurrentSessionAction();

  if (!session) {
    notFound();
  }

  if (!data.success || !data.data?.me) {
    return (
      <div className="max-width-container mt-6 xl:mt-12">
        <h1 className="text-2xl font-medium">
          Failed to load account details.
        </h1>
      </div>
    );
  }

  const user = data.data.me;

  return (
    <div className="max-width-container my-6 sm:my-12 flex flex-col gap-y-6 sm:gap-y-12">
      <div className="flex flex-col gap-y-3 sm:gap-y-6">
        <h1 className="text-2xl sm:text-5xl font-medium">Account Details</h1>
        <Card className="w-full flex flex-col gap-y-2 sm:gap-y-5 p-3 sm:p-4">
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-[8px] sm:text-xs leading-[120%] text-muted-foreground">
                Name and Last Name
              </span>
              <span className="text-base sm:text-2xl">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <Button
              className="block sm:hidden"
              size={"xs"}
              variant={"secondary"}
            >
              Edit
            </Button>
            <Button
              className="hidden sm:block"
              size={"default"}
              variant={"secondary"}
            >
              Edit
            </Button>
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-[8px] sm:text-xs leading-[120%] text-muted-foreground">
                Email
              </span>
              <span className="text-base sm:text-2xl">{user.email}</span>
            </div>
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-1">
              <span className="font-mono text-[8px] sm:text-xs leading-[120%] text-muted-foreground">
                Avatar
              </span>
              {user.avatar ? (
                <img
                  src={getImageSrc(user.avatar.mimeType, user.avatar.base64)}
                  alt="User avatar"
                />
              ) : (
                <div className="rounded-full bg-cyan-600 size-12 sm:size-20 flex items-center justify-center">
                  <span className="text-white text-3xl sm:text-5xl font-medium">
                    {user.firstName!.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <Button
              className="block sm:hidden"
              size={"xs"}
              variant={"secondary"}
            >
              Change Avatar
            </Button>
            <Button
              className="hidden sm:block"
              size={"default"}
              variant={"secondary"}
            >
              Change Avatar
            </Button>
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-[8px] sm:text-xs leading-[120%] text-muted-foreground">
                Password
              </span>
              <span className="text-base sm:text-2xl">********</span>
            </div>
            <Button
              className="block sm:hidden"
              size={"xs"}
              variant={"secondary"}
            >
              Change Password
            </Button>
            <Button
              className="hidden sm:block"
              size={"default"}
              variant={"secondary"}
            >
              Change Password
            </Button>
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-[8px] sm:text-xs leading-[120%] text-muted-foreground">
                Updated At
              </span>
              <span className="text-base sm:text-2xl">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] sm:w-[400px] flex flex-col gap-y-0">
              <span className="font-mono text-[8px] sm:text-xs leading-[120%] text-muted-foreground">
                Member Since
              </span>
              <span className="text-base sm:text-2xl">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex flex-col gap-y-3 sm:gap-y-6">
        <h1 className="text-2xl sm:text-5xl font-medium">Orders</h1>
        <Card className="w-full py-0 overflow-hidden">
          <Table className="w-full">
            <TableHeader className="w-full">
              <TableRow className="w-full *:h-fit p-3 sm:p-4 *:font-mono *:text-muted-foreground *:font-medium *:text-xs *:sm:text-sm grid grid-cols-[1fr_1fr_1fr_1fr_2fr] sm:grid-cols-[1fr_1fr_1fr_1fr_1fr_2fr] items-center">
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="hidden sm:block">Items</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    {order.status === OrderStatus.Pending && (
                      <Button size={"default"}>Pay</Button>
                    )}
                    <Button
                      className="hidden md:block"
                      size={"default"}
                      variant={"destructive"}
                      disabled={
                        order.status !== OrderStatus.Pending &&
                        order.status !== OrderStatus.Processing
                      }
                    >
                      Cancel
                    </Button>
                    <div>
                      <Button
                        className="block sm:hidden"
                        size={"xs"}
                        variant={"secondary"}
                      >
                        Details
                      </Button>
                      <Button
                        className="hidden sm:block"
                        size={"default"}
                        variant={"secondary"}
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-xs sm:text-sm mb-2">
              A list of your orders.
            </TableCaption>
          </Table>
        </Card>
      </div>
    </div>
  );
}
