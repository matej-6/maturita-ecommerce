import { graphql } from "@/graphql";
import "server-only";

export const HeaderQueryDocument = graphql(`
  query HeaderQuery {
    categories(parentCategoryId: null, isSetup: true, isPublic: true) {
      id
      name
      description
      slug
      subcategories {
        id
        slug
        name
        isPublic
        isSetup
      }
    }
  }
`);
