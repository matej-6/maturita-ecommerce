import {
  getAdminUsersPageData,
  PagingArgs,
  SortingArgs,
  TableArgs,
} from "@/app/data-access-layer/admin/user/actions";
import { Role, UserSortingField } from "@/graphql/graphql";
import { UsersTableWithFilters } from "../components/users/users-table-with-filters";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function UsersPage({ searchParams }: Props) {
  const sp = await searchParams;

  const sortingArgs: SortingArgs = {
    ascending: null,
    sortBy: null,
  };

  const tableArgs: TableArgs = {
    id: null,
    email: null,
    role: null,
  };

  const pagingArgs: PagingArgs = {
    cursor: null,
    nextCursor: null,
    pageSize: 25,
  };

  function parseSortBy(value: string): UserSortingField | null {
    switch (value.toLowerCase()) {
      case UserSortingField.Id.toString().toLowerCase():
        return UserSortingField.Id;
      case UserSortingField.Email.toString().toLowerCase():
        return UserSortingField.Email;
      case UserSortingField.Role.toString().toLowerCase():
        return UserSortingField.Role;
      case UserSortingField.CreatedAt.toString().toLowerCase():
        return UserSortingField.CreatedAt;
      case UserSortingField.UpdatedAt.toString().toLowerCase():
        return UserSortingField.UpdatedAt;
      default:
        return null;
    }
  }

  function parseRole(value: string): Role | null {
    switch (value.toLowerCase()) {
      case "admin":
        return Role.Admin;
      case "user":
        return Role.User;
      default:
        return null;
    }
  }

  sortingArgs.ascending =
    sp.ascending === "true" ? true : sp.ascending === "false" ? false : null;

  sortingArgs.sortBy =
    typeof sp.sortBy === "string" ? parseSortBy(sp.sortBy) : null;

  pagingArgs.cursor =
    typeof sp.cursor === "string" ? (parseInt(sp.cursor, 10) ?? null) : null;
  pagingArgs.pageSize =
    typeof sp.pageSize === "string" ? (parseInt(sp.pageSize, 10) ?? 25) : 25;

  if (typeof sp.id === "string") {
    const parsedId = parseInt(sp.id, 10);
    tableArgs.id = isNaN(parsedId) ? null : parsedId;
  }

  if (typeof sp.email === "string") {
    tableArgs.email = sp.email;
  }

  if (typeof sp.role === "string") {
    tableArgs.role = parseRole(sp.role);
  }

  const usersData = await getAdminUsersPageData({
    ...pagingArgs,
    ...sortingArgs,
    ...tableArgs,
  });

  pagingArgs.nextCursor = usersData.success
    ? (usersData.data?.findAllPaginatedUsers.nextCursor ?? null)
    : null;

  const urlSearchParams = new URLSearchParams({
    ...(pagingArgs.cursor ? { cursor: pagingArgs.cursor.toString() } : {}),
    ...(pagingArgs.pageSize
      ? { pageSize: pagingArgs.pageSize.toString() }
      : {}),
    ...(sortingArgs.sortBy
      ? { sortBy: sortingArgs.sortBy.toString().toLowerCase() }
      : {}),
    ...(sortingArgs.ascending !== null
      ? { ascending: sortingArgs.ascending.toString() }
      : {}),
    ...(tableArgs.id ? { id: tableArgs.id.toString() } : {}),
    ...(tableArgs.email ? { email: tableArgs.email } : {}),
    ...(tableArgs.role
      ? { role: tableArgs.role.toString().toLowerCase() }
      : {}),
  });

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col">
        <UsersTableWithFilters
          initialPagingArgs={pagingArgs}
          initialSortingArgs={sortingArgs}
          initialTableArgs={tableArgs}
          searchParams={urlSearchParams.toString()}
          data={
            usersData.success
              ? usersData.data?.findAllPaginatedUsers.edges?.map((p) => ({
                  id: p.node.id,
                  role: p.node.role,
                  email: p.node.email,
                  createdAt: new Date(p.node.createdAt),
                  updatedAt: new Date(p.node.updatedAt),
                })) || null
              : null
          }
        />
      </div>
    </div>
  );
}
