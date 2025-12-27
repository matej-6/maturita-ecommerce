import { graphql } from "@/graphql";
import "server-only";

export const AdminUpdateUserRoleMutationDocument = graphql(`
  mutation AdminUpdateUserRole($id: Int!, $role: Role!) {
    updateUserRole(userId: $id, newRole: $role)
  }
`);
