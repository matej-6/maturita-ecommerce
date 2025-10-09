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
    "\n  fragment CategoryTable_QueryFragment on Query {\n    categories(parentId: $parentId) {\n      id\n      slug\n      translations(langs: $langs) {\n        id\n      }\n    }\n  }\n": typeof types.CategoryTable_QueryFragmentFragmentDoc,
    "\n  query localesQuery {\n    locales {\n      code\n      name\n    }\n  }\n": typeof types.LocalesQueryDocument,
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": typeof types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": typeof types.MeDocument,
    "\n  query HeaderQuery {\n    ...HeaderNav_QueryFragment\n  }\n": typeof types.HeaderQueryDocument,
    "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentId: \"\") {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        name\n        slug\n      }\n    }\n  }\n": typeof types.HeaderNav_QueryFragmentFragmentDoc,
    "\n  query MeQuery {\n    me {\n      id\n      email\n      firstName\n      lastName\n      emailVerified\n      avatar\n      createdAt\n      updatedAt\n      role\n    }\n  }\n": typeof types.MeQueryDocument,
};
const documents: Documents = {
    "\n  fragment CategoryParentSelectDataFragment on Category {\n    id\n    slug\n  }\n": types.CategoryParentSelectDataFragmentFragmentDoc,
    "\n  fragment CategoryTable_QueryFragment on Query {\n    categories(parentId: $parentId) {\n      id\n      slug\n      translations(langs: $langs) {\n        id\n      }\n    }\n  }\n": types.CategoryTable_QueryFragmentFragmentDoc,
    "\n  query localesQuery {\n    locales {\n      code\n      name\n    }\n  }\n": types.LocalesQueryDocument,
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": types.MeDocument,
    "\n  query HeaderQuery {\n    ...HeaderNav_QueryFragment\n  }\n": types.HeaderQueryDocument,
    "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentId: \"\") {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        name\n        slug\n      }\n    }\n  }\n": types.HeaderNav_QueryFragmentFragmentDoc,
    "\n  query MeQuery {\n    me {\n      id\n      email\n      firstName\n      lastName\n      emailVerified\n      avatar\n      createdAt\n      updatedAt\n      role\n    }\n  }\n": types.MeQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryParentSelectDataFragment on Category {\n    id\n    slug\n  }\n"): typeof import('./graphql').CategoryParentSelectDataFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryTable_QueryFragment on Query {\n    categories(parentId: $parentId) {\n      id\n      slug\n      translations(langs: $langs) {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').CategoryTable_QueryFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query localesQuery {\n    locales {\n      code\n      name\n    }\n  }\n"): typeof import('./graphql').LocalesQueryDocument;
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
export function graphql(source: "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentId: \"\") {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        name\n        slug\n      }\n    }\n  }\n"): typeof import('./graphql').HeaderNav_QueryFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MeQuery {\n    me {\n      id\n      email\n      firstName\n      lastName\n      emailVerified\n      avatar\n      createdAt\n      updatedAt\n      role\n    }\n  }\n"): typeof import('./graphql').MeQueryDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
