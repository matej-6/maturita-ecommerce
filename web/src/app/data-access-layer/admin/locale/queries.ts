import "server-only";
import { graphql } from "@/graphql";
import { cache } from "react";
import { fetchGraphql } from "../../fetch-graphql";

const localesQueryDocument = graphql(`
  query LocalesQueryDocument {
    ...Locales_QueryFragment
  }
`);

export const getLocalesQuery = cache(async () => {
  return await fetchGraphql(localesQueryDocument);
});
