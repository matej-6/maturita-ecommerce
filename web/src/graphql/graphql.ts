/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  isSetup: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  parentCategoryId?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  subcategories: Array<Category>;
  /** Category translations */
  translations?: Maybe<Array<CategoryTranslation>>;
  updatedAt: Scalars['DateTime']['output'];
};


export type CategoryTranslationsArgs = {
  filtersInput: CategoryTranslationsQueryFilter;
};

export type CategoryFindAllQueryFilterInput = {
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
  /** null - only categories with no parent category will be returned, '*' - all categories will be returned, 'uuid' - only the children of category with given uuid will be returned */
  parentCategoryId?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryFindOneQueryFilterInput = {
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryTranslation = {
  __typename?: 'CategoryTranslation';
  categoryId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryTranslationsQueryFilter = {
  /** empty array - all translations will be returned, [...string] - only the translation matching the locales in array will be returned */
  locales: Array<Scalars['String']['input']>;
};

export type CreateCategoryInput = {
  /** Parent category id */
  parentCategoryId?: InputMaybe<Scalars['String']['input']>;
  /** Slug of the category */
  slug: Scalars['String']['input'];
};

export type CreateCategoryTranslationInput = {
  /** category id */
  categoryId: Scalars['ID']['input'];
  /** Category description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Locale code */
  localeCode: Scalars['String']['input'];
  /** Category name */
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  confirmPassword: Scalars['String']['input'];
  email: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type EditCategoryTranslationInput = {
  /** category translation id */
  categoryTranslationId: Scalars['ID']['input'];
  /** Category description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Locale code */
  localeCode: Scalars['String']['input'];
  /** Category name */
  name: Scalars['String']['input'];
};

export type Locale = {
  __typename?: 'Locale';
  /** Locale code */
  code: Scalars['String']['output'];
  flag: Scalars['String']['output'];
  /** Native locale name */
  name: Scalars['String']['output'];
};

export type MeResponse = {
  __typename?: 'MeResponse';
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createCategoryTranslation: CategoryTranslation;
  createUser: User;
  deleteCategoryTranslation: Scalars['ID']['output'];
  logoutAll: Scalars['Void']['output'];
  removeCategory: Category;
  removeUser: User;
  requestEmailVerification: Scalars['Void']['output'];
  updateCategory: Category;
  updateCategoryTranslation: CategoryTranslation;
  updateUser: User;
  verifyEmail: Scalars['Void']['output'];
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationCreateCategoryTranslationArgs = {
  newTranslationinput: CreateCategoryTranslationInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteCategoryTranslationArgs = {
  categoryTranslationId: Scalars['ID']['input'];
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};


export type MutationUpdateCategoryTranslationArgs = {
  editTranslationInput: EditCategoryTranslationInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};


export type MutationVerifyEmailArgs = {
  verifyEmailInput: VerifyEmailInput;
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  category: Category;
  locale: Locale;
  locales: Array<Locale>;
  me: MeResponse;
  user: User;
  users: Array<User>;
};


export type QueryCategoriesArgs = {
  filtersInput?: InputMaybe<CategoryFindAllQueryFilterInput>;
};


export type QueryCategoryArgs = {
  filters?: InputMaybe<CategoryFindOneQueryFilterInput>;
  id: Scalars['ID']['input'];
};


export type QueryLocaleArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

/** User role */
export enum Role {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER'
}

export type UpdateCategoryInput = {
  id: Scalars['ID']['input'];
  /** Parent category id */
  parentCategoryId?: InputMaybe<Scalars['String']['input']>;
  /** Slug of the category */
  slug: Scalars['String']['input'];
};

export type UpdateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type VerifyEmailInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type CategoryParentSelectDataFragmentFragment = { __typename?: 'Category', id: string, slug: string } & { ' $fragmentName'?: 'CategoryParentSelectDataFragmentFragment' };

export type CategoryTable_QueryFragmentFragment = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, slug: string, translations?: Array<{ __typename?: 'CategoryTranslation', id: string }> | null }> } & { ' $fragmentName'?: 'CategoryTable_QueryFragmentFragment' };

export type DeleteCategoryTranslationMutationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryTranslationMutationMutation = { __typename?: 'Mutation', deleteCategoryTranslation: string };

export type NewCategoryTranslationMutationMutationVariables = Exact<{
  categoryId: Scalars['ID']['input'];
  localeCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type NewCategoryTranslationMutationMutation = { __typename?: 'Mutation', createCategoryTranslation: { __typename?: 'CategoryTranslation', name: string, locale: string, description?: string | null } };

export type EditCategoryTranslationMutationMutationVariables = Exact<{
  translationId: Scalars['ID']['input'];
  localeCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditCategoryTranslationMutationMutation = { __typename?: 'Mutation', updateCategoryTranslation: { __typename?: 'CategoryTranslation', name: string, description?: string | null, locale: string } };

export type AllCategories_QueryFragmentFragment = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, slug: string, parentCategoryId?: string | null }> } & { ' $fragmentName'?: 'AllCategories_QueryFragmentFragment' };

export type NewCategoryMutationMutationVariables = Exact<{
  parentCategoryId?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
}>;


export type NewCategoryMutationMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string } };

export type EditCategoryMutationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  parentCategoryId?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
}>;


export type EditCategoryMutationMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', slug: string, parentCategoryId?: string | null } };

export type NewCategory_QueryDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type NewCategory_QueryDocumentQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'AllCategories_QueryFragmentFragment': AllCategories_QueryFragmentFragment;'Locales_QueryFragmentFragment': Locales_QueryFragmentFragment } }
);

export type EditCategory_QueryDocumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EditCategory_QueryDocumentQuery = (
  { __typename?: 'Query', category: { __typename?: 'Category', slug: string, name?: string | null, parentCategoryId?: string | null, isSetup: boolean, isPublic: boolean, translations?: Array<{ __typename?: 'CategoryTranslation', id: string, locale: string, name: string, description?: string | null }> | null, subcategories: Array<{ __typename?: 'Category', slug: string, id: string }> }, locales: Array<{ __typename?: 'Locale', code: string, name: string, flag: string }> }
  & { ' $fragmentRefs'?: { 'AllCategories_QueryFragmentFragment': AllCategories_QueryFragmentFragment } }
);

export type Locales_QueryFragmentFragment = { __typename?: 'Query', locales: Array<{ __typename?: 'Locale', code: string, name: string }> } & { ' $fragmentName'?: 'Locales_QueryFragmentFragment' };

export type LocalesQueryDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type LocalesQueryDocumentQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'Locales_QueryFragmentFragment': Locales_QueryFragmentFragment } }
);

export type MeFragmentFragment = { __typename?: 'MeResponse', id: string, avatar?: string | null, emailVerified: boolean, firstName?: string | null, lastName?: string | null, role: Role, email: string } & { ' $fragmentName'?: 'MeFragmentFragment' };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: (
    { __typename?: 'MeResponse' }
    & { ' $fragmentRefs'?: { 'MeFragmentFragment': MeFragmentFragment } }
  ) };

export type HeaderQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type HeaderQueryQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'HeaderNav_QueryFragmentFragment': HeaderNav_QueryFragmentFragment } }
);

export type HeaderNav_QueryFragmentFragment = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name?: string | null, description: string, slug: string, subcategories: Array<{ __typename?: 'Category', id: string, slug: string, name?: string | null }> }> } & { ' $fragmentName'?: 'HeaderNav_QueryFragmentFragment' };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const CategoryParentSelectDataFragmentFragmentDoc = new TypedDocumentString(`
    fragment CategoryParentSelectDataFragment on Category {
  id
  slug
}
    `, {"fragmentName":"CategoryParentSelectDataFragment"}) as unknown as TypedDocumentString<CategoryParentSelectDataFragmentFragment, unknown>;
export const CategoryTable_QueryFragmentFragmentDoc = new TypedDocumentString(`
    fragment CategoryTable_QueryFragment on Query {
  categories(filtersInput: {parentCategoryId: $parentId}) {
    id
    slug
    translations(filtersInput: {locales: $langs}) {
      id
    }
  }
}
    `, {"fragmentName":"CategoryTable_QueryFragment"}) as unknown as TypedDocumentString<CategoryTable_QueryFragmentFragment, unknown>;
export const AllCategories_QueryFragmentFragmentDoc = new TypedDocumentString(`
    fragment AllCategories_QueryFragment on Query {
  categories(filtersInput: {parentCategoryId: "*"}) {
    id
    slug
    parentCategoryId
  }
}
    `, {"fragmentName":"AllCategories_QueryFragment"}) as unknown as TypedDocumentString<AllCategories_QueryFragmentFragment, unknown>;
export const Locales_QueryFragmentFragmentDoc = new TypedDocumentString(`
    fragment Locales_QueryFragment on Query {
  locales {
    code
    name
  }
}
    `, {"fragmentName":"Locales_QueryFragment"}) as unknown as TypedDocumentString<Locales_QueryFragmentFragment, unknown>;
export const MeFragmentFragmentDoc = new TypedDocumentString(`
    fragment MeFragment on MeResponse {
  id
  avatar
  emailVerified
  firstName
  lastName
  role
  email
}
    `, {"fragmentName":"MeFragment"}) as unknown as TypedDocumentString<MeFragmentFragment, unknown>;
export const HeaderNav_QueryFragmentFragmentDoc = new TypedDocumentString(`
    fragment HeaderNav_QueryFragment on Query {
  categories(filtersInput: {parentCategoryId: null}) {
    id
    name
    description
    slug
    subcategories {
      id
      slug
      name
    }
  }
}
    `, {"fragmentName":"HeaderNav_QueryFragment"}) as unknown as TypedDocumentString<HeaderNav_QueryFragmentFragment, unknown>;
export const DeleteCategoryTranslationMutationDocument = new TypedDocumentString(`
    mutation DeleteCategoryTranslationMutation($id: ID!) {
  deleteCategoryTranslation(categoryTranslationId: $id)
}
    `) as unknown as TypedDocumentString<DeleteCategoryTranslationMutationMutation, DeleteCategoryTranslationMutationMutationVariables>;
export const NewCategoryTranslationMutationDocument = new TypedDocumentString(`
    mutation NewCategoryTranslationMutation($categoryId: ID!, $localeCode: String!, $name: String!, $description: String) {
  createCategoryTranslation(
    newTranslationinput: {categoryId: $categoryId, localeCode: $localeCode, name: $name, description: $description}
  ) {
    name
    locale
    description
  }
}
    `) as unknown as TypedDocumentString<NewCategoryTranslationMutationMutation, NewCategoryTranslationMutationMutationVariables>;
export const EditCategoryTranslationMutationDocument = new TypedDocumentString(`
    mutation EditCategoryTranslationMutation($translationId: ID!, $localeCode: String!, $name: String!, $description: String) {
  updateCategoryTranslation(
    editTranslationInput: {categoryTranslationId: $translationId, name: $name, description: $description, localeCode: $localeCode}
  ) {
    name
    description
    locale
  }
}
    `) as unknown as TypedDocumentString<EditCategoryTranslationMutationMutation, EditCategoryTranslationMutationMutationVariables>;
export const NewCategoryMutationDocument = new TypedDocumentString(`
    mutation NewCategoryMutation($parentCategoryId: String, $slug: String!) {
  createCategory(
    createCategoryInput: {parentCategoryId: $parentCategoryId, slug: $slug}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<NewCategoryMutationMutation, NewCategoryMutationMutationVariables>;
export const EditCategoryMutationDocument = new TypedDocumentString(`
    mutation EditCategoryMutation($id: ID!, $parentCategoryId: String, $slug: String!) {
  updateCategory(
    updateCategoryInput: {id: $id, parentCategoryId: $parentCategoryId, slug: $slug}
  ) {
    slug
    parentCategoryId
  }
}
    `) as unknown as TypedDocumentString<EditCategoryMutationMutation, EditCategoryMutationMutationVariables>;
export const NewCategory_QueryDocumentDocument = new TypedDocumentString(`
    query newCategory_QueryDocument {
  ...AllCategories_QueryFragment
  ...Locales_QueryFragment
}
    fragment AllCategories_QueryFragment on Query {
  categories(filtersInput: {parentCategoryId: "*"}) {
    id
    slug
    parentCategoryId
  }
}
fragment Locales_QueryFragment on Query {
  locales {
    code
    name
  }
}`) as unknown as TypedDocumentString<NewCategory_QueryDocumentQuery, NewCategory_QueryDocumentQueryVariables>;
export const EditCategory_QueryDocumentDocument = new TypedDocumentString(`
    query editCategory_QueryDocument($id: ID!) {
  category(id: $id, filters: {isPublic: null, isSetup: null}) {
    slug
    name
    parentCategoryId
    isSetup
    isPublic
    translations(filtersInput: {locales: []}) {
      id
      locale
      name
      description
    }
    subcategories {
      slug
      id
    }
  }
  locales {
    code
    name
    flag
  }
  ...AllCategories_QueryFragment
}
    fragment AllCategories_QueryFragment on Query {
  categories(filtersInput: {parentCategoryId: "*"}) {
    id
    slug
    parentCategoryId
  }
}`) as unknown as TypedDocumentString<EditCategory_QueryDocumentQuery, EditCategory_QueryDocumentQueryVariables>;
export const LocalesQueryDocumentDocument = new TypedDocumentString(`
    query LocalesQueryDocument {
  ...Locales_QueryFragment
}
    fragment Locales_QueryFragment on Query {
  locales {
    code
    name
  }
}`) as unknown as TypedDocumentString<LocalesQueryDocumentQuery, LocalesQueryDocumentQueryVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    ...MeFragment
  }
}
    fragment MeFragment on MeResponse {
  id
  avatar
  emailVerified
  firstName
  lastName
  role
  email
}`) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const HeaderQueryDocument = new TypedDocumentString(`
    query HeaderQuery {
  ...HeaderNav_QueryFragment
}
    fragment HeaderNav_QueryFragment on Query {
  categories(filtersInput: {parentCategoryId: null}) {
    id
    name
    description
    slug
    subcategories {
      id
      slug
      name
    }
  }
}`) as unknown as TypedDocumentString<HeaderQueryQuery, HeaderQueryQueryVariables>;