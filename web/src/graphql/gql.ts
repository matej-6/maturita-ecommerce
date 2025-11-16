/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment CategoryParentSelectDataFragment on Category {\n    id\n    slug\n  }\n": typeof types.CategoryParentSelectDataFragmentFragmentDoc,
    "\n  fragment CategoryTable_QueryFragment on Query {\n    categories(parentCategoryId: $parentId) {\n      id\n      slug\n      translations(locales: $langs) {\n        id\n      }\n    }\n  }\n": typeof types.CategoryTable_QueryFragmentFragmentDoc,
    "\n    mutation DeleteCategoryTranslationMutation($id: Int!) {\n      deleteCategoryTranslation(categoryTranslationId: $id)\n    }\n  ": typeof types.DeleteCategoryTranslationMutationDocument,
    "\n  mutation NewCategoryTranslationMutation(\n    $categoryId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n  ) {\n    createCategoryTranslation(\n      newTranslationinput: {\n        categoryId: $categoryId\n        localeCode: $localeCode\n        name: $name\n        description: $description\n      }\n    ) {\n      name\n      locale\n      description\n    }\n  }\n": typeof types.NewCategoryTranslationMutationDocument,
    "\n  mutation EditCategoryTranslationMutation(\n    $translationId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n  ) {\n    updateCategoryTranslation(\n      editTranslationInput: {\n        categoryTranslationId: $translationId\n        name: $name\n        description: $description\n        localeCode: $localeCode\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n": typeof types.EditCategoryTranslationMutationDocument,
    "\n  fragment AllCategories_QueryFragment on Query {\n    categories(parentCategoryId: 0, isPublic: null, isSetup: null) {\n      id\n      slug\n      parentCategoryId\n    }\n  }\n": typeof types.AllCategories_QueryFragmentFragmentDoc,
    "\n  mutation NewCategoryMutation($parentCategoryId: Int, $slug: String!) {\n    createCategory(\n      createCategoryInput: { parentCategoryId: $parentCategoryId, slug: $slug }\n    ) {\n      id\n    }\n  }\n": typeof types.NewCategoryMutationDocument,
    "\n  mutation EditCategoryMutation(\n    $id: Int!\n    $parentCategoryId: Int\n    $slug: String!\n  ) {\n    updateCategory(\n      updateCategoryInput: {\n        id: $id\n        parentCategoryId: $parentCategoryId\n        slug: $slug\n      }\n    ) {\n      slug\n      parentCategoryId\n    }\n  }\n": typeof types.EditCategoryMutationDocument,
    "\n  query categoriesTable_QueryDocument(\n    $parentCategoryId: Int\n    $pageSize: Int\n    $cursor: Int\n    $slug: String\n    $id: Int\n    $isSetup: Boolean\n    $isPublic: Boolean\n    $ascending: Boolean\n    $sortBy: String\n  ) {\n    paginatedCategories(\n      ascending: $ascending\n      cursor: $cursor\n      pageSize: $pageSize\n      isPublic: $isPublic\n      isSetup: $isSetup\n      idQuery: $id\n      slugQuery: $slug\n      parentCategoryId: $parentCategoryId\n      sortBy: $sortBy\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          slug\n          createdAt\n          updatedAt\n          isSetup\n          isPublic\n          name\n          productsCount\n          parentCategoryId\n        }\n      }\n      hasNextPage\n      totalCount\n    }\n  }\n": typeof types.CategoriesTable_QueryDocumentDocument,
    "\n  query newCategory_QueryDocument {\n    ...AllCategories_QueryFragment\n    ...Locales_QueryFragment\n  }\n": typeof types.NewCategory_QueryDocumentDocument,
    "\n  query editCategory_QueryDocument(\n    $id: Int!\n    $productCursor: Int\n    $productPageSize: Int\n  ) {\n    category(id: $id, isPublic: null, isSetup: null) {\n      slug\n      name\n      parentCategoryId\n      isSetup\n      isPublic\n      productsCount\n      translations(locales: []) {\n        id\n        locale\n        name\n        description\n      }\n      subcategories {\n        slug\n        id\n      }\n    }\n    products(\n      categoryId: $id\n      cursor: $productCursor\n      pageSize: $productPageSize\n      isPublic: null\n      isSetup: null\n    ) {\n      hasNextPage\n      edges {\n        cursor\n        node {\n          id\n          slug\n          name\n        }\n      }\n    }\n    locales {\n      code\n      name\n      flag\n    }\n    ...AllCategories_QueryFragment\n  }\n": typeof types.EditCategory_QueryDocumentDocument,
    "\n  fragment Locales_QueryFragment on Query {\n    locales {\n      code\n      name\n    }\n  }\n": typeof types.Locales_QueryFragmentFragmentDoc,
    "\n  query LocalesQueryDocument {\n    ...Locales_QueryFragment\n  }\n": typeof types.LocalesQueryDocumentDocument,
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": typeof types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": typeof types.MeDocument,
    "\n  query HeaderQuery {\n    ...HeaderNav_QueryFragment\n  }\n": typeof types.HeaderQueryDocument,
    "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentCategoryId: null) {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        slug\n        name\n      }\n    }\n  }\n": typeof types.HeaderNav_QueryFragmentFragmentDoc,
};
const documents: Documents = {
    "\n  fragment CategoryParentSelectDataFragment on Category {\n    id\n    slug\n  }\n": types.CategoryParentSelectDataFragmentFragmentDoc,
    "\n  fragment CategoryTable_QueryFragment on Query {\n    categories(parentCategoryId: $parentId) {\n      id\n      slug\n      translations(locales: $langs) {\n        id\n      }\n    }\n  }\n": types.CategoryTable_QueryFragmentFragmentDoc,
    "\n    mutation DeleteCategoryTranslationMutation($id: Int!) {\n      deleteCategoryTranslation(categoryTranslationId: $id)\n    }\n  ": types.DeleteCategoryTranslationMutationDocument,
    "\n  mutation NewCategoryTranslationMutation(\n    $categoryId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n  ) {\n    createCategoryTranslation(\n      newTranslationinput: {\n        categoryId: $categoryId\n        localeCode: $localeCode\n        name: $name\n        description: $description\n      }\n    ) {\n      name\n      locale\n      description\n    }\n  }\n": types.NewCategoryTranslationMutationDocument,
    "\n  mutation EditCategoryTranslationMutation(\n    $translationId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n  ) {\n    updateCategoryTranslation(\n      editTranslationInput: {\n        categoryTranslationId: $translationId\n        name: $name\n        description: $description\n        localeCode: $localeCode\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n": types.EditCategoryTranslationMutationDocument,
    "\n  fragment AllCategories_QueryFragment on Query {\n    categories(parentCategoryId: 0, isPublic: null, isSetup: null) {\n      id\n      slug\n      parentCategoryId\n    }\n  }\n": types.AllCategories_QueryFragmentFragmentDoc,
    "\n  mutation NewCategoryMutation($parentCategoryId: Int, $slug: String!) {\n    createCategory(\n      createCategoryInput: { parentCategoryId: $parentCategoryId, slug: $slug }\n    ) {\n      id\n    }\n  }\n": types.NewCategoryMutationDocument,
    "\n  mutation EditCategoryMutation(\n    $id: Int!\n    $parentCategoryId: Int\n    $slug: String!\n  ) {\n    updateCategory(\n      updateCategoryInput: {\n        id: $id\n        parentCategoryId: $parentCategoryId\n        slug: $slug\n      }\n    ) {\n      slug\n      parentCategoryId\n    }\n  }\n": types.EditCategoryMutationDocument,
    "\n  query categoriesTable_QueryDocument(\n    $parentCategoryId: Int\n    $pageSize: Int\n    $cursor: Int\n    $slug: String\n    $id: Int\n    $isSetup: Boolean\n    $isPublic: Boolean\n    $ascending: Boolean\n    $sortBy: String\n  ) {\n    paginatedCategories(\n      ascending: $ascending\n      cursor: $cursor\n      pageSize: $pageSize\n      isPublic: $isPublic\n      isSetup: $isSetup\n      idQuery: $id\n      slugQuery: $slug\n      parentCategoryId: $parentCategoryId\n      sortBy: $sortBy\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          slug\n          createdAt\n          updatedAt\n          isSetup\n          isPublic\n          name\n          productsCount\n          parentCategoryId\n        }\n      }\n      hasNextPage\n      totalCount\n    }\n  }\n": types.CategoriesTable_QueryDocumentDocument,
    "\n  query newCategory_QueryDocument {\n    ...AllCategories_QueryFragment\n    ...Locales_QueryFragment\n  }\n": types.NewCategory_QueryDocumentDocument,
    "\n  query editCategory_QueryDocument(\n    $id: Int!\n    $productCursor: Int\n    $productPageSize: Int\n  ) {\n    category(id: $id, isPublic: null, isSetup: null) {\n      slug\n      name\n      parentCategoryId\n      isSetup\n      isPublic\n      productsCount\n      translations(locales: []) {\n        id\n        locale\n        name\n        description\n      }\n      subcategories {\n        slug\n        id\n      }\n    }\n    products(\n      categoryId: $id\n      cursor: $productCursor\n      pageSize: $productPageSize\n      isPublic: null\n      isSetup: null\n    ) {\n      hasNextPage\n      edges {\n        cursor\n        node {\n          id\n          slug\n          name\n        }\n      }\n    }\n    locales {\n      code\n      name\n      flag\n    }\n    ...AllCategories_QueryFragment\n  }\n": types.EditCategory_QueryDocumentDocument,
    "\n  fragment Locales_QueryFragment on Query {\n    locales {\n      code\n      name\n    }\n  }\n": types.Locales_QueryFragmentFragmentDoc,
    "\n  query LocalesQueryDocument {\n    ...Locales_QueryFragment\n  }\n": types.LocalesQueryDocumentDocument,
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": types.MeDocument,
    "\n  query HeaderQuery {\n    ...HeaderNav_QueryFragment\n  }\n": types.HeaderQueryDocument,
    "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentCategoryId: null) {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        slug\n        name\n      }\n    }\n  }\n": types.HeaderNav_QueryFragmentFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryParentSelectDataFragment on Category {\n    id\n    slug\n  }\n"): typeof import('./graphql').CategoryParentSelectDataFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryTable_QueryFragment on Query {\n    categories(parentCategoryId: $parentId) {\n      id\n      slug\n      translations(locales: $langs) {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').CategoryTable_QueryFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteCategoryTranslationMutation($id: Int!) {\n      deleteCategoryTranslation(categoryTranslationId: $id)\n    }\n  "): typeof import('./graphql').DeleteCategoryTranslationMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation NewCategoryTranslationMutation(\n    $categoryId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n  ) {\n    createCategoryTranslation(\n      newTranslationinput: {\n        categoryId: $categoryId\n        localeCode: $localeCode\n        name: $name\n        description: $description\n      }\n    ) {\n      name\n      locale\n      description\n    }\n  }\n"): typeof import('./graphql').NewCategoryTranslationMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditCategoryTranslationMutation(\n    $translationId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n  ) {\n    updateCategoryTranslation(\n      editTranslationInput: {\n        categoryTranslationId: $translationId\n        name: $name\n        description: $description\n        localeCode: $localeCode\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n"): typeof import('./graphql').EditCategoryTranslationMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AllCategories_QueryFragment on Query {\n    categories(parentCategoryId: 0, isPublic: null, isSetup: null) {\n      id\n      slug\n      parentCategoryId\n    }\n  }\n"): typeof import('./graphql').AllCategories_QueryFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation NewCategoryMutation($parentCategoryId: Int, $slug: String!) {\n    createCategory(\n      createCategoryInput: { parentCategoryId: $parentCategoryId, slug: $slug }\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').NewCategoryMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditCategoryMutation(\n    $id: Int!\n    $parentCategoryId: Int\n    $slug: String!\n  ) {\n    updateCategory(\n      updateCategoryInput: {\n        id: $id\n        parentCategoryId: $parentCategoryId\n        slug: $slug\n      }\n    ) {\n      slug\n      parentCategoryId\n    }\n  }\n"): typeof import('./graphql').EditCategoryMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query categoriesTable_QueryDocument(\n    $parentCategoryId: Int\n    $pageSize: Int\n    $cursor: Int\n    $slug: String\n    $id: Int\n    $isSetup: Boolean\n    $isPublic: Boolean\n    $ascending: Boolean\n    $sortBy: String\n  ) {\n    paginatedCategories(\n      ascending: $ascending\n      cursor: $cursor\n      pageSize: $pageSize\n      isPublic: $isPublic\n      isSetup: $isSetup\n      idQuery: $id\n      slugQuery: $slug\n      parentCategoryId: $parentCategoryId\n      sortBy: $sortBy\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          slug\n          createdAt\n          updatedAt\n          isSetup\n          isPublic\n          name\n          productsCount\n          parentCategoryId\n        }\n      }\n      hasNextPage\n      totalCount\n    }\n  }\n"): typeof import('./graphql').CategoriesTable_QueryDocumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query newCategory_QueryDocument {\n    ...AllCategories_QueryFragment\n    ...Locales_QueryFragment\n  }\n"): typeof import('./graphql').NewCategory_QueryDocumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query editCategory_QueryDocument(\n    $id: Int!\n    $productCursor: Int\n    $productPageSize: Int\n  ) {\n    category(id: $id, isPublic: null, isSetup: null) {\n      slug\n      name\n      parentCategoryId\n      isSetup\n      isPublic\n      productsCount\n      translations(locales: []) {\n        id\n        locale\n        name\n        description\n      }\n      subcategories {\n        slug\n        id\n      }\n    }\n    products(\n      categoryId: $id\n      cursor: $productCursor\n      pageSize: $productPageSize\n      isPublic: null\n      isSetup: null\n    ) {\n      hasNextPage\n      edges {\n        cursor\n        node {\n          id\n          slug\n          name\n        }\n      }\n    }\n    locales {\n      code\n      name\n      flag\n    }\n    ...AllCategories_QueryFragment\n  }\n"): typeof import('./graphql').EditCategory_QueryDocumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Locales_QueryFragment on Query {\n    locales {\n      code\n      name\n    }\n  }\n"): typeof import('./graphql').Locales_QueryFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LocalesQueryDocument {\n    ...Locales_QueryFragment\n  }\n"): typeof import('./graphql').LocalesQueryDocumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n"): typeof import('./graphql').MeFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HeaderQuery {\n    ...HeaderNav_QueryFragment\n  }\n"): typeof import('./graphql').HeaderQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentCategoryId: null) {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        slug\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').HeaderNav_QueryFragmentFragmentDoc;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
