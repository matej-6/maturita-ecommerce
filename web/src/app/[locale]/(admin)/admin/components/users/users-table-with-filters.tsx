"use client";

import {
  PagingArgs,
  SortingArgs,
  TableArgs,
} from "@/app/data-access-layer/admin/user/actions";
import { OrderStatusLabel } from "@/components/order-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Role, UserSortingField } from "@/graphql/graphql";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  initialPagingArgs: PagingArgs;
  initialSortingArgs: SortingArgs;
  initialTableArgs: TableArgs;
  searchParams: string;
  data:
    | {
        id: number;
        role: Role;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null;
};

export function UsersTableWithFilters({
  initialPagingArgs,
  initialSortingArgs,
  initialTableArgs,
  searchParams,
  data,
}: Props) {
  const [tableArgs, setTableArgs] = useState(initialTableArgs);
  const [isTableArgsChanged, setIsTableArgsChanged] = useState(false);

  useEffect(() => {
    setTableArgs(initialTableArgs);
  }, [initialTableArgs]);

  useEffect(() => {
    setIsTableArgsChanged(
      initialTableArgs.id !== tableArgs.id ||
        initialTableArgs.email !== tableArgs.email ||
        initialTableArgs.role !== tableArgs.role
    );
  }, [tableArgs, initialTableArgs]);

  const router = useRouter();

  function applyFilters() {
    const id = tableArgs.id && isNaN(tableArgs.id) ? null : tableArgs.id;
    const email = tableArgs.email ? tableArgs.email : null;
    const role = tableArgs.role ? tableArgs.role : null;
    const newParams = new URLSearchParams();
    newParams.set("id", id !== null ? id.toString() : "");
    newParams.set("email", email !== null ? email.toString() : "");
    newParams.set("role", role !== null ? role.toString().toLowerCase() : "");
    router.push(`?${newParams.toString()}`);
  }

  function clearFilters() {
    const newParams = new URLSearchParams();
    router.push(`?${newParams.toString()}`);
  }

  function nextPage() {
    if (!initialPagingArgs.nextCursor) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("cursor", initialPagingArgs.nextCursor.toString());
    router.push(`?${newParams.toString()}`);
  }

  function prevPage() {
    if (initialPagingArgs.cursor === null) return;
    router.back();
  }

  function changePageSize(newPageSize: number) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("pageSize", newPageSize.toString());
    newParams.delete("cursor");
    router.push(`?${newParams.toString()}`);
  }

  function changeSortingColumn(sortBy: string | null, ascending: boolean) {
    const newParams = new URLSearchParams(searchParams);
    if (sortBy === null) {
      newParams.delete("sortBy");
      newParams.delete("ascending");
    } else {
      newParams.set("sortBy", sortBy);
      newParams.set("ascending", ascending.toString());
    }
    newParams.delete("cursor");
    router.push(`?${newParams.toString()}`);
  }

  const sortableColumns = Object.keys(UserSortingField).map((v) =>
    v.toString().toLowerCase()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="id">ID</Label>
            <Input
              id="id"
              value={tableArgs.id ?? ""}
              onChange={(e) => {
                const parsedId = parseInt(e.target.value, 10);
                if (!isNaN(parsedId)) {
                  setTableArgs((prev) => ({
                    ...prev,
                    id: parsedId,
                  }));
                }
              }}
              placeholder="type an ID to filter by"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={tableArgs.email ?? ""}
              onChange={(e) => {
                setTableArgs((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              placeholder="type an email to filter by"
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              onValueChange={(v) => {
                setTableArgs((prev) => ({
                  ...prev,
                  role: v === "null" ? null : (v as Role),
                }));
              }}
              value={tableArgs.role === null ? "null" : tableArgs.role}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">All</SelectItem>
                {Object.values(Role).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-x-2 items-center justify-start">
          <Button
            disabled={!isTableArgsChanged}
            variant={"secondary"}
            onClick={() => applyFilters()}
          >
            Apply Filters
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              clearFilters();
            }}
          >
            Clear
          </Button>
        </div>
        <div className="max-w-fit flex justify-start items-center gap-x-2">
          <Button
            size={"sm"}
            variant={"secondary"}
            disabled={initialPagingArgs.cursor === null}
            onClick={() => {
              prevPage();
            }}
          >
            Previous
          </Button>
          <Button
            variant={"secondary"}
            size={"sm"}
            disabled={initialPagingArgs.nextCursor === null}
            onClick={() => nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden">
        {data !== null && data.length > 0 ? (
          <Table className="overflow-x-scroll p-2">
            <TableHeader>
              <TableRow className="">
                {[
                  {
                    label: "ID",
                    key: "id",
                    isSortByPossible: sortableColumns.includes("id"),
                  },
                  {
                    label: "Email",
                    key: "email",
                    isSortByPossible: sortableColumns.includes("email"),
                  },
                  {
                    label: "Role",
                    key: "role",
                    isSortByPossible: sortableColumns.includes("role"),
                  },
                  {
                    label: "Created At",
                    key: "createdAt",
                    isSortByPossible: sortableColumns.includes("createdat"),
                  },
                  {
                    label: "Updated At",
                    key: "updatedAt",
                    isSortByPossible: sortableColumns.includes("updatedat"),
                  },
                ].map((column) => (
                  <TableHead
                    className="p-4"
                    key={column.key}
                    onClick={() => {
                      if (!column.isSortByPossible) return;
                      const nextIsAscending =
                        initialSortingArgs.sortBy === null
                          ? true
                          : initialSortingArgs.sortBy
                              .toString()
                              .toLowerCase() !== column.key.toLowerCase()
                          ? true
                          : initialSortingArgs.ascending === null
                          ? true
                          : initialSortingArgs.ascending === true
                          ? false
                          : null;
                      changeSortingColumn(
                        nextIsAscending === null
                          ? null
                          : column.key.toLowerCase(),
                        nextIsAscending === null ? true : nextIsAscending
                      );
                    }}
                  >
                    <div
                      className={cn("flex gap-x-1 justify-start items-center", {
                        "cursor-pointer hover:underline":
                          column.isSortByPossible,
                      })}
                    >
                      <span>{column.label}</span>
                      <ChevronUpIcon
                        className={cn("size-4 opacity-0", {
                          "opacity-100!":
                            initialSortingArgs.sortBy
                              ?.toString()
                              .toLowerCase() === column.key.toLowerCase(),
                          "rotate-180":
                            initialSortingArgs.sortBy
                              ?.toString()
                              .toLowerCase() === column.key.toLowerCase() &&
                            initialSortingArgs.ascending,
                        })}
                      />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id} className="text-left px-2 py-1">
                  <TableCell className="px-4 py-2">{user.id}</TableCell>
                  <TableCell className="px-4 py-2">{user.email}</TableCell>
                  <TableCell className="px-4 py-2">{user.role}</TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(user.createdAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {new Date(user.updatedAt).toLocaleString().split(",")[0]}
                  </TableCell>
                  <TableCell className="px-4 py-2 flex justify-end">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-4">No users found.</div>
        )}
      </div>
    </div>
  );
}
