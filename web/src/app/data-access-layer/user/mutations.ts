import { graphql } from "@/graphql";
import "server-only";

export const DeleteUserAccountMutation = graphql(`
  mutation DeleteUserAccountMutation {
    deleteAccount
  }
`);

export const UpdateAccountAvatarMutation = graphql(`
  mutation UpdateAccountAvatarMutation($base64: String!, $mimeType: String!) {
    uploadAvatar(base64: $base64, mimeType: $mimeType)
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
