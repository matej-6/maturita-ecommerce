"use client";

import { AdminUpdateOrderAction } from "@/app/data-access-layer/admin/order/actions";
import { updateUserRoleAction } from "@/app/data-access-layer/admin/user/actions";
import { ResponsiveButton } from "@/components/responsive-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Role } from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  userId: number;
  role: Role;
};

export function UpdateUserRoleSheetForm({ userId, role }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role>(role);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await updateUserRoleAction(userId, selectedRole);
      if (!res.success) {
        throw new Error(res.message || "Failed to update user role");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ResponsiveButton variant={"secondary"}>Update Role</ResponsiveButton>
      </SheetTrigger>
      <SheetContent className="p-2 sm:p-4 flex flex-col gap-y-4">
        <SheetHeader className="p-0!">
          <SheetTitle>Update User Role</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="flex flex-col gap-y-4"
        >
          <Select
            onValueChange={(v) => {
              setSelectedRole(v as Role);
            }}
            value={selectedRole}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Role.Admin}>Admin</SelectItem>
              <SelectItem value={Role.User}>User</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-y-2">
            <ResponsiveButton type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Role"}
            </ResponsiveButton>
            <SheetClose asChild>
              <ResponsiveButton variant={"secondary"}>Cancel</ResponsiveButton>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
