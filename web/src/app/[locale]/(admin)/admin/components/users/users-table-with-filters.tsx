"use client";

import {
  PagingArgs,
  SortingArgs,
  TableArgs,
} from "@/app/data-access-layer/admin/user/actions";
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
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { UpdateUserRoleSheetForm } from "./update-user-role-sheet-form";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const ft = useTranslations("fields.user");
  const t = useTranslations("admin.users.table");

  const [tableArgs, setTableArgs] = useState(initialTableArgs);

  useEffect(() => {
    setTableArgs(initialTableArgs);
  }, [initialTableArgs]);

  const isTableArgsChanged =
    initialTableArgs.id !== tableArgs.id ||
    initialTableArgs.email !== tableArgs.email ||
    initialTableArgs.role !== tableArgs.role;

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

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        {!filtersOpen ? (
          <Button variant={"outline"} onClick={() => setFiltersOpen(true)}>
            {t("filters.buttons.showFilters")}
          </Button>
        ) : (
          <Button variant={"outline"} onClick={() => setFiltersOpen(false)}>
            {t("filters.buttons.hideFilters")}
          </Button>
        )}
      </div>
      {filtersOpen && (
        <Card className="p-2 sm:p-4 flex flex-col gap-y-4">
          <CardHeader className="p-0!">
            <CardTitle>{t("filters.title")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0! flex flex-col gap-y-4">
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="id">{ft("id")}</Label>
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
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="email">{ft("email")}</Label>
              <Input
                id="email"
                value={tableArgs.email ?? ""}
                onChange={(e) => {
                  setTableArgs((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-2">
              <Label htmlFor="role">{ft("role")}</Label>
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
                  <SelectValue placeholder={t("filters.roleSelect.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">
                    {t("filters.roleSelect.all")}
                  </SelectItem>
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-x-2 items-center justify-start">
              <Button
                disabled={!isTableArgsChanged}
                variant={"default"}
                onClick={() => applyFilters()}
              >
                {t("filters.buttons.apply")}
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => {
                  clearFilters();
                }}
              >
                {t("filters.buttons.clear")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="rounded-xl overflow-hidden">
        {data !== null && data.length > 0 ? (
          <Table className="overflow-x-scroll p-2">
            <TableHeader>
              <TableRow className="">
                {[
                  {
                    label: ft("id"),
                    key: "id",
                    sortingKey: UserSortingField.Id,
                  },
                  {
                    label: ft("email"),
                    key: "email",
                    sortingKey: UserSortingField.Email,
                  },
                  {
                    label: ft("role"),
                    key: "role",
                    sortingKey: UserSortingField.Role,
                  },
                  {
                    label: ft("createdAt"),
                    key: "createdAt",
                    sortingKey: UserSortingField.CreatedAt,
                  },
                  {
                    label: ft("updatedAt"),
                    key: "updatedAt",
                    sortingKey: UserSortingField.UpdatedAt,
                  },
                ].map((column) => (
                  <TableHead
                    className="p-4"
                    key={column.key}
                    onClick={() => {
                      if (!column.sortingKey) return;
                      const nextIsAscending =
                        initialSortingArgs.sortBy === null
                          ? true
                          : initialSortingArgs.sortBy !== column.sortingKey
                            ? true
                            : initialSortingArgs.ascending === null
                              ? true
                              : initialSortingArgs.ascending === true
                                ? false
                                : null;
                      changeSortingColumn(
                        nextIsAscending === null
                          ? null
                          : column.sortingKey.toString().toLowerCase(),
                        nextIsAscending === null ? true : nextIsAscending,
                      );
                    }}
                  >
                    <div
                      className={cn("flex gap-x-1 justify-start items-center", {
                        "cursor-pointer hover:underline":
                          column.sortingKey !== undefined,
                      })}
                    >
                      <span>{column.label}</span>
                      <ChevronUpIcon
                        className={cn("size-4 opacity-0", {
                          "opacity-100!":
                            initialSortingArgs.sortBy === column.sortingKey,
                          "rotate-180":
                            initialSortingArgs.sortBy === column.sortingKey &&
                            initialSortingArgs.ascending,
                        })}
                      />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="sr-only">{t("actions.label")}</TableHead>
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
                    <UpdateUserRoleSheetForm
                      userId={user.id}
                      role={user.role}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-4">{t("noUsersFound")}</div>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          size={"sm"}
          variant={"outline"}
          disabled={initialPagingArgs.cursor === null}
          onClick={() => {
            prevPage();
          }}
        >
          {t("paging.buttons.previous")}
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          disabled={initialPagingArgs.nextCursor === null}
          onClick={() => nextPage()}
        >
          {t("paging.buttons.next")}
        </Button>
      </div>
    </div>
  );
}
