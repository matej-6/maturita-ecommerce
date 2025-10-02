import { graphql } from "@/graphql";

const CategoryFragment = graphql(`
  fragment HeaderCategoryFragment on Category {
    id
    slug
    name
  }
`);

export const HeaderCategoriesDocument = graphql(`
  query headerCategories {
    categories(parentId: "") {
      ...HeaderCategoryFragment
      subcategories {
        ...HeaderCategoryFragment
      }
    }
  }
`);
