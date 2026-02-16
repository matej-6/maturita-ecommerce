import { graphql } from "@/graphql";
import "server-only";

export const DeleteUserAccountMutation = graphql(`
  mutation DeleteUserAccountMutation {
    deleteAccount
  }
`);

export const UpdateUserMutation = graphql(`
  mutation UpdateUserMutation(
    $name: String!
    $lastName: String!
    $email: String!
  ) {
    updateUser(input: { email: $email, name: $name, lastName: $lastName }) {
      id
    }
  }
`);

export const DeleteAccountAvatarMutation = graphql(`
  mutation DeleteAccountAvatarMutation {
    deleteAvatar
  }
`);

export const UpdateUserPasswordMutation = graphql(`
  mutation UpdateUserPasswordMutation(
    $currentPassword: String!
    $newPassword: String!
    $confirmNewPassword: String!
  ) {
    updatePassword(
      input: {
        currentPassword: $currentPassword
        newPassword: $newPassword
        confirmNewPassword: $confirmNewPassword
      }
    )
  }
`);
