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

export type AuthInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  parentCategoryId?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  subcategories: Array<Category>;
  /** Category translations */
  translations: Array<CategoryTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};


export type CategoryTranslationsArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryTranslation = {
  __typename?: 'CategoryTranslation';
  categoryId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  locale: Locale;
  localeId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateCategoryInput = {
  /** Parent category id */
  parentCategoryId?: InputMaybe<Scalars['String']['input']>;
  /** Slug of the category */
  slug: Scalars['String']['input'];
  /** Category translations */
  translations: Array<CreateCategoryTranslationInput>;
};

export type CreateCategoryTranslationInput = {
  /** Category description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Locale code */
  localeCode: Scalars['String']['input'];
  /** Category name */
  name: Scalars['String']['input'];
};

export type CreateLocaleInput = {
  /** Locale code */
  code: Scalars['String']['input'];
  /** Is the locale active? */
  isActive: Scalars['Boolean']['input'];
  /** Native locale name */
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  confirmPassword: Scalars['String']['input'];
  email: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Locale = {
  __typename?: 'Locale';
  /** Locale code */
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Is the locale active? */
  isActive: Scalars['Boolean']['output'];
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
  createLocale: Locale;
  createUser: User;
  login: AuthResponse;
  logoutAll: Scalars['Void']['output'];
  refreshToken: Scalars['Void']['output'];
  removeCategory: Category;
  removeLocale: Locale;
  removeUser: User;
  requestEmailVerification: Scalars['Void']['output'];
  updateCategory: Category;
  updateLocale: Locale;
  updateUser: User;
  verifyEmail: Scalars['Void']['output'];
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationCreateLocaleArgs = {
  createLocaleInput: CreateLocaleInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationLoginArgs = {
  authInput: AuthInput;
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveLocaleArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};


export type MutationUpdateLocaleArgs = {
  updateLocaleInput: UpdateLocaleInput;
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
  locale?: InputMaybe<Scalars['String']['input']>;
  withParentId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCategoryArgs = {
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

export type UpdateLocaleInput = {
  /** Locale code */
  code: Scalars['String']['input'];
  /** Locale ID */
  id: Scalars['ID']['input'];
  /** Is the locale active? */
  isActive: Scalars['Boolean']['input'];
  /** Native locale name */
  name: Scalars['String']['input'];
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

export type CategoryFieldsFragment = { __typename?: 'Category', id: string, slug: string, parentCategoryId?: string | null, translations: Array<{ __typename?: 'CategoryTranslation', id: string, name: string, description?: string | null }> } & { ' $fragmentName'?: 'CategoryFieldsFragment' };

export type CategoryWithChildrenFieldsFragment = (
  { __typename?: 'Category', subcategories: Array<(
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
  )> }
  & { ' $fragmentRefs'?: { 'CategoryFieldsFragment': CategoryFieldsFragment } }
) & { ' $fragmentName'?: 'CategoryWithChildrenFieldsFragment' };

export type AllCategoriesQueryVariables = Exact<{
  locale?: InputMaybe<Scalars['String']['input']>;
}>;


export type AllCategoriesQuery = { __typename?: 'Query', categories: Array<(
    { __typename?: 'Category' }
    & { ' $fragmentRefs'?: { 'CategoryWithChildrenFieldsFragment': CategoryWithChildrenFieldsFragment } }
  )> };

export type MeQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQueryQuery = { __typename?: 'Query', me: { __typename?: 'MeResponse', id: string, email: string, firstName?: string | null, lastName?: string | null, emailVerified: boolean, avatar?: string | null, createdAt: any, updatedAt: any, role: Role } };

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
export const CategoryFieldsFragmentDoc = new TypedDocumentString(`
    fragment CategoryFields on Category {
  id
  slug
  parentCategoryId
  translations(locale: $locale) {
    id
    name
    description
  }
}
    `, {"fragmentName":"CategoryFields"}) as unknown as TypedDocumentString<CategoryFieldsFragment, unknown>;
export const CategoryWithChildrenFieldsFragmentDoc = new TypedDocumentString(`
    fragment CategoryWithChildrenFields on Category {
  ...CategoryFields
  subcategories {
    ...CategoryFields
  }
}
    fragment CategoryFields on Category {
  id
  slug
  parentCategoryId
  translations(locale: $locale) {
    id
    name
    description
  }
}`, {"fragmentName":"CategoryWithChildrenFields"}) as unknown as TypedDocumentString<CategoryWithChildrenFieldsFragment, unknown>;
export const AllCategoriesDocument = new TypedDocumentString(`
    query AllCategories($locale: String) {
  categories(withParentId: null, locale: $locale) {
    ...CategoryWithChildrenFields
  }
}
    fragment CategoryFields on Category {
  id
  slug
  parentCategoryId
  translations(locale: $locale) {
    id
    name
    description
  }
}
fragment CategoryWithChildrenFields on Category {
  ...CategoryFields
  subcategories {
    ...CategoryFields
  }
}`) as unknown as TypedDocumentString<AllCategoriesQuery, AllCategoriesQueryVariables>;
export const MeQueryDocument = new TypedDocumentString(`
    query MeQuery {
  me {
    id
    email
    firstName
    lastName
    emailVerified
    avatar
    createdAt
    updatedAt
    role
  }
}
    `) as unknown as TypedDocumentString<MeQueryQuery, MeQueryQueryVariables>;