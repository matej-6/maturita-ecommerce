import "server-only";
import { graphql } from "@/graphql";
import { cache } from "react";
import { fetchGraphql } from "../fetch-graphql";

export const localesQueryDocument = graphql(`
  query localesQuery {
    locales {
      code
      name
    }
  }
`);

export const getLocalesQuery = cache(async () => {
  return await fetchGraphql(localesQueryDocument);
});
