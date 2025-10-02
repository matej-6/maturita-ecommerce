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
  name: Scalars['String']['output'];
  parentCategoryId?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  subcategories: Array<Category>;
  /** Category translations */
  translations: Array<CategoryTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};


export type CategoryTranslationsArgs = {
  langs?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CategoryTranslation = {
  __typename?: 'CategoryTranslation';
  categoryId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  locale: Scalars['String']['output'];
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
  createUser: User;
  logoutAll: Scalars['Void']['output'];
  removeCategory: Category;
  removeUser: User;
  requestEmailVerification: Scalars['Void']['output'];
  updateCategory: Category;
  updateUser: User;
  verifyEmail: Scalars['Void']['output'];
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
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
  parentId: Scalars['String']['input'];
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

export type HeaderCategoryFragmentFragment = { __typename?: 'Category', id: string, slug: string, name: string } & { ' $fragmentName'?: 'HeaderCategoryFragmentFragment' };

export type HeaderCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type HeaderCategoriesQuery = { __typename?: 'Query', categories: Array<(
    { __typename?: 'Category', subcategories: Array<(
      { __typename?: 'Category' }
      & { ' $fragmentRefs'?: { 'HeaderCategoryFragmentFragment': HeaderCategoryFragmentFragment } }
    )> }
    & { ' $fragmentRefs'?: { 'HeaderCategoryFragmentFragment': HeaderCategoryFragmentFragment } }
  )> };

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
export const HeaderCategoryFragmentFragmentDoc = new TypedDocumentString(`
    fragment HeaderCategoryFragment on Category {
  id
  slug
  name
}
    `, {"fragmentName":"HeaderCategoryFragment"}) as unknown as TypedDocumentString<HeaderCategoryFragmentFragment, unknown>;
export const HeaderCategoriesDocument = new TypedDocumentString(`
    query headerCategories {
  categories(parentId: "") {
    ...HeaderCategoryFragment
    subcategories {
      ...HeaderCategoryFragment
    }
  }
}
    fragment HeaderCategoryFragment on Category {
  id
  slug
  name
}`) as unknown as TypedDocumentString<HeaderCategoriesQuery, HeaderCategoriesQueryVariables>;