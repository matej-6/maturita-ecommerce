import "server-only";
import { graphql } from "@/graphql";

export const AccountDetailsPageDocument = graphql(`
  query AccountDetailsPageQuery {
    me {
      firstName
      lastName
      email
      avatarUrl
      createdAt
      updatedAt
      orders {
        id
        totalInCents
        createdAt
        items {
          sku
        }
        status
      }
    }
  }
`);
