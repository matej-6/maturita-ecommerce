import { graphql } from "@/graphql";
import "server-only";

export const AdminUsersPageDocument = graphql(`
  query AdminUsersPage(
    $id: Int
    $role: Role
    $email: String
    $pageSize: Int
    $sortBy: UserSortingField
    $cursor: Int
    $ascending: Boolean
  ) {
    findAllPaginatedUsers(
      id: $id
      role: $role
      email: $email
      pageSize: $pageSize
      sortBy: $sortBy
      cursor: $cursor
      ascending: $ascending
    ) {
      hasNextPage
      totalCount
      edges {
        cursor
        node {
          id
          email
          role
          createdAt
          updatedAt
        }
      }
    }
  }
`);
