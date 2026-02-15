import "server-only";
import { graphql } from "@/graphql";
import { MeFragmentFragment } from "@/graphql/graphql";

export const MeFragment = graphql(`
  fragment MeFragment on User {
    id
    firstName
    lastName
    role
    email
    avatar {
      base64
      mimeType
    }
  }
`);

export const meQueryDocument = graphql(`
  query Me {
    me {
      ...MeFragment
    }
  }
`);

export type CurrentSession = MeFragmentFragment | null;
