import { graphql } from "@/graphql";
import { cache } from "react";
import "server-only";
import { fetchGraphql } from "./fetch-graphql";

const HeaderQueryDocument = graphql(`
  query HeaderQuery {
    ...HeaderNav_QueryFragment
  }
`);

export const getHeaderQueryData = cache(async () => {
  return await fetchGraphql(HeaderQueryDocument);
});

const CategoryQueryDocument = graphql(`
  query CategoryQuery($slug: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      subcategories {
        slug
        name
        description
      }
    }
  }
`);
