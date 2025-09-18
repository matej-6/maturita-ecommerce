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
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": typeof types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": typeof types.MeDocument,
    "\n  query AllCategories {\n    categories(withParentId: null) {\n      id\n      slug\n    }\n  }\n": typeof types.AllCategoriesDocument,
    "\n  query MeQuery {\n    me {\n      id\n      email\n      firstName\n      lastName\n      emailVerified\n      avatar\n      createdAt\n      updatedAt\n      role\n    }\n  }\n": typeof types.MeQueryDocument,
};
const documents: Documents = {
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": types.MeDocument,
    "\n  query AllCategories {\n    categories(withParentId: null) {\n      id\n      slug\n    }\n  }\n": types.AllCategoriesDocument,
    "\n  query MeQuery {\n    me {\n      id\n      email\n      firstName\n      lastName\n      emailVerified\n      avatar\n      createdAt\n      updatedAt\n      role\n    }\n  }\n": types.MeQueryDocument,
};

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
export function graphql(source: "\n  query AllCategories {\n    categories(withParentId: null) {\n      id\n      slug\n    }\n  }\n"): typeof import('./graphql').AllCategoriesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MeQuery {\n    me {\n      id\n      email\n      firstName\n      lastName\n      emailVerified\n      avatar\n      createdAt\n      updatedAt\n      role\n    }\n  }\n"): typeof import('./graphql').MeQueryDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
