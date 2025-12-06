import { graphql } from "@/graphql";

export const Locales_QueryFragment = graphql(`
  fragment Locales_QueryFragment on Query {
    locales {
      code
      name
    }
  }
`);
