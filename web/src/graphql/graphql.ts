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
  categoryProductVariants: PaginatedProductVariant;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isPublic: Scalars['Boolean']['output'];
  isSetup: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  parentCategoryId?: Maybe<Scalars['Int']['output']>;
  productsCount: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  subcategories: Array<Category>;
  translations: Array<CategoryTranslation>;
  updatedAt: Scalars['DateTime']['output'];
  usedProductVariantAttributes: Array<ProductVariantAttribute>;
};


export type CategoryCategoryProductVariantsArgs = {
  attributeFilters?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  includeSubcategories?: InputMaybe<Scalars['Boolean']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type CategoryTranslationsArgs = {
  locales: Array<Scalars['String']['input']>;
};

export type CategoryEdge = {
  __typename?: 'CategoryEdge';
  cursor: Scalars['Int']['output'];
  node: Category;
};

export type CategoryTranslation = {
  __typename?: 'CategoryTranslation';
  categoryId: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  locale: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CreateCategoryInput = {
  /** Parent category id */
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  /** Slug of the category */
  slug: Scalars['String']['input'];
};

export type CreateCategoryTranslationInput = {
  /** category id */
  categoryId: Scalars['Int']['input'];
  /** Category description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Locale code */
  localeCode: Scalars['String']['input'];
  /** Category name */
  name: Scalars['String']['input'];
};

export type CreateProductInput = {
  /** Parent category id */
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  isPublic: Scalars['Boolean']['input'];
  /** Product slug */
  slug: Scalars['String']['input'];
};

export type CreateProductTranslationInput = {
  /** Product description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Locale code */
  localeCode: Scalars['String']['input'];
  /** Product markdown content */
  markdownContent?: InputMaybe<Scalars['String']['input']>;
  /** Product name */
  name: Scalars['String']['input'];
};

export type CreateProductVariantAttributeInput = {
  /** Attribute Key ID */
  keyId: Scalars['Int']['input'];
  /** Attribute Value */
  value: Scalars['String']['input'];
};

export type CreateProductVariantAttributeKeyInput = {
  key: Scalars['String']['input'];
};

export type CreateProductVariantInput = {
  /** List of Product Variant Attribute IDs */
  attributes: Array<Scalars['Int']['input']>;
  isPublic: Scalars['Boolean']['input'];
  priceInCents: Scalars['Int']['input'];
  productId: Scalars['Int']['input'];
  /** Stock keeping unit */
  sku: Scalars['String']['input'];
  stock: Scalars['Int']['input'];
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
  categoryTranslationId: Scalars['Int']['input'];
  /** Category description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Locale code */
  localeCode: Scalars['String']['input'];
  /** Category name */
  name: Scalars['String']['input'];
};

export type EditProductTranslationInput = {
  /** Product description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Locale code */
  localeCode: Scalars['String']['input'];
  /** Product markdown content */
  markdownContent?: InputMaybe<Scalars['String']['input']>;
  /** Product name */
  name: Scalars['String']['input'];
  /** product translation id */
  productTranslationId: Scalars['Int']['input'];
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
  addProductImage: ProductImage;
  addProductVariantImage: ProductVariantImage;
  createCategory: Category;
  createCategoryTranslation: CategoryTranslation;
  createProduct: Product;
  createProductTranslation: ProductTranslation;
  createProductVariant: ProductVariant;
  createProductVariantAttribute: ProductVariantAttribute;
  createProductVariantAttributeKey: ProductVariantAttributeKey;
  createUser: User;
  deleteCategoryTranslation: Scalars['Int']['output'];
  deleteProductImage: Scalars['Int']['output'];
  deleteProductTranslation: Scalars['Int']['output'];
  editProductTranslation: ProductTranslation;
  logoutAll: Scalars['Void']['output'];
  removeCategory: Category;
  removeProduct: Product;
  removeProductVariant: Scalars['Int']['output'];
  removeProductVariantAttribute: ProductVariantAttribute;
  removeProductVariantAttributeKey: ProductVariantAttributeKey;
  removeProductVariantImage: Scalars['Int']['output'];
  removeUser: User;
  requestEmailVerification: Scalars['Void']['output'];
  setProductThumbnailImage: ProductImage;
  setProductVariantThumbnailImage: ProductVariantImage;
  updateCategory: Category;
  updateCategoryTranslation: CategoryTranslation;
  updateProduct: Product;
  updateProductVariant: ProductVariant;
  updateProductVariantAttribute: ProductVariantAttribute;
  updateProductVariantAttributeKey: ProductVariantAttributeKey;
  updateUser: User;
  verifyEmail: Scalars['Void']['output'];
};


export type MutationAddProductImageArgs = {
  base64: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationAddProductVariantImageArgs = {
  base64: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  productVariantId: Scalars['Int']['input'];
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationCreateCategoryTranslationArgs = {
  newTranslationinput: CreateCategoryTranslationInput;
};


export type MutationCreateProductArgs = {
  createProductInput: CreateProductInput;
};


export type MutationCreateProductTranslationArgs = {
  createProductTranslationInput: CreateProductTranslationInput;
  productId: Scalars['Int']['input'];
};


export type MutationCreateProductVariantArgs = {
  createProductVariantInput: CreateProductVariantInput;
};


export type MutationCreateProductVariantAttributeArgs = {
  createProductVariantAttributeInput: CreateProductVariantAttributeInput;
};


export type MutationCreateProductVariantAttributeKeyArgs = {
  createProductVariantAttributeKeyInput: CreateProductVariantAttributeKeyInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDeleteCategoryTranslationArgs = {
  categoryTranslationId: Scalars['Int']['input'];
};


export type MutationDeleteProductImageArgs = {
  productImageId: Scalars['Int']['input'];
};


export type MutationDeleteProductTranslationArgs = {
  productTranslationId: Scalars['Int']['input'];
};


export type MutationEditProductTranslationArgs = {
  editProductTranslationInput: EditProductTranslationInput;
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveProductArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveProductVariantArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveProductVariantAttributeArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveProductVariantAttributeKeyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveProductVariantImageArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetProductThumbnailImageArgs = {
  productImageId: Scalars['Int']['input'];
};


export type MutationSetProductVariantThumbnailImageArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};


export type MutationUpdateCategoryTranslationArgs = {
  editTranslationInput: EditCategoryTranslationInput;
};


export type MutationUpdateProductArgs = {
  updateProductInput: UpdateProductInput;
};


export type MutationUpdateProductVariantArgs = {
  updateProductVariantInput: UpdateProductVariantInput;
};


export type MutationUpdateProductVariantAttributeArgs = {
  updateProductVariantAttributeInput: UpdateProductVariantAttributeInput;
};


export type MutationUpdateProductVariantAttributeKeyArgs = {
  updateProductVariantAttributeKeyInput: UpdateProductVariantAttributeKeyInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};


export type MutationVerifyEmailArgs = {
  verifyEmailInput: VerifyEmailInput;
};

export type PaginatedCategory = {
  __typename?: 'PaginatedCategory';
  edges?: Maybe<Array<CategoryEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginatedProduct = {
  __typename?: 'PaginatedProduct';
  edges?: Maybe<Array<ProductEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginatedProductVariant = {
  __typename?: 'PaginatedProductVariant';
  edges?: Maybe<Array<ProductVariantEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  categoryId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** Product ID */
  id: Scalars['Int']['output'];
  images: Array<ProductImage>;
  isPublic: Scalars['Boolean']['output'];
  isSetup: Scalars['Boolean']['output'];
  markdownContent?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** Product slug */
  slug: Scalars['String']['output'];
  thumbnailImage?: Maybe<ProductImage>;
  translations: Array<ProductTranslation>;
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<ProductVariant>;
};


export type ProductVariantsArgs = {
  includeHidden?: Scalars['Boolean']['input'];
};

export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['Int']['output'];
  node: Product;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  base64: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isThumbnail: Scalars['Boolean']['output'];
  mimeType: Scalars['String']['output'];
  productId: Scalars['Int']['output'];
};

export type ProductTranslation = {
  __typename?: 'ProductTranslation';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  locale: Scalars['String']['output'];
  markdownContent?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  productId: Scalars['Int']['output'];
};

export type ProductVariant = {
  __typename?: 'ProductVariant';
  attributes: Array<ProductVariantAttribute>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  images: Array<ProductVariantImage>;
  isPublic: Scalars['Boolean']['output'];
  priceInCents: Scalars['Int']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  sku: Scalars['String']['output'];
  stock: Scalars['Int']['output'];
  thumbnailImage?: Maybe<ProductVariantImage>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariantAttribute = {
  __typename?: 'ProductVariantAttribute';
  attributeKeyId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  key?: Maybe<ProductVariantAttributeKey>;
  productVariantId?: Maybe<Scalars['Int']['output']>;
  translatedValue?: Maybe<Scalars['String']['output']>;
  translations: Array<ProductVariantAttributeTranslation>;
  value: Scalars['String']['output'];
};

export type ProductVariantAttributeKey = {
  __typename?: 'ProductVariantAttributeKey';
  attributes: Array<ProductVariantAttribute>;
  id: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  translatedKey?: Maybe<Scalars['String']['output']>;
  translations: Array<ProductVariantAttributeKeyTranslation>;
};

export type ProductVariantAttributeKeyTranslation = {
  __typename?: 'ProductVariantAttributeKeyTranslation';
  attributeKeyId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  keyTranslation: Scalars['String']['output'];
  locale: Scalars['String']['output'];
};

export type ProductVariantAttributeTranslation = {
  __typename?: 'ProductVariantAttributeTranslation';
  attributeId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  locale: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ProductVariantEdge = {
  __typename?: 'ProductVariantEdge';
  cursor: Scalars['Int']['output'];
  node: ProductVariant;
};

export type ProductVariantImage = {
  __typename?: 'ProductVariantImage';
  base64: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isThumbnail: Scalars['Boolean']['output'];
  mimeType: Scalars['String']['output'];
  productVariantId: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  category: Category;
  findOneProductVariantAttribute?: Maybe<ProductVariantAttribute>;
  locale: Locale;
  locales: Array<Locale>;
  me: MeResponse;
  paginatedCategories: PaginatedCategory;
  product?: Maybe<Product>;
  productVariantAttributeKey: ProductVariantAttributeKey;
  productVariantAttributeKeys: Array<ProductVariantAttributeKey>;
  productVariantAttributes: Array<ProductVariantAttribute>;
  products: PaginatedProduct;
  searchProductVariants: PaginatedProductVariant;
  user: User;
  users: Array<User>;
};


export type QueryCategoriesArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  idQuery?: InputMaybe<Scalars['Int']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  slugQuery?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCategoryArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFindOneProductVariantAttributeArgs = {
  id: Scalars['Int']['input'];
};


export type QueryLocaleArgs = {
  id: Scalars['String']['input'];
};


export type QueryPaginatedCategoriesArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  idQuery?: InputMaybe<Scalars['Int']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  slugQuery?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['Int']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryProductVariantAttributeKeyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductVariantAttributeKeysArgs = {
  productId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductsArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchProductVariantsArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  attributeFilters?: InputMaybe<Array<Array<Scalars['String']['input']>>>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

/** User role */
export enum Role {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER'
}

export type UpdateCategoryInput = {
  /** Category id */
  id: Scalars['Int']['input'];
  /** Parent category id */
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  /** Slug of the category */
  slug: Scalars['String']['input'];
};

export type UpdateProductInput = {
  /** Parent category id */
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  isPublic: Scalars['Boolean']['input'];
  /** Product slug */
  slug: Scalars['String']['input'];
};

export type UpdateProductVariantAttributeInput = {
  id: Scalars['Int']['input'];
  /** Attribute Value */
  value: Scalars['String']['input'];
};

export type UpdateProductVariantAttributeKeyInput = {
  id: Scalars['Int']['input'];
  key?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductVariantInput = {
  /** List of Product Variant Attribute IDs */
  attributes?: InputMaybe<Array<Scalars['Int']['input']>>;
  id: Scalars['Int']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  priceInCents?: InputMaybe<Scalars['Int']['input']>;
  productId?: InputMaybe<Scalars['Int']['input']>;
  /** Stock keeping unit */
  sku?: InputMaybe<Scalars['String']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id: Scalars['Int']['input'];
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

export type CategoryParentSelectDataFragmentFragment = { __typename?: 'Category', id: number, slug: string } & { ' $fragmentName'?: 'CategoryParentSelectDataFragmentFragment' };

export type DeleteCategoryTranslationMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCategoryTranslationMutationMutation = { __typename?: 'Mutation', deleteCategoryTranslation: number };

export type NewCategoryTranslationMutationMutationVariables = Exact<{
  categoryId: Scalars['Int']['input'];
  localeCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type NewCategoryTranslationMutationMutation = { __typename?: 'Mutation', createCategoryTranslation: { __typename?: 'CategoryTranslation', name: string, locale: string, description?: string | null } };

export type EditCategoryTranslationMutationMutationVariables = Exact<{
  translationId: Scalars['Int']['input'];
  localeCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditCategoryTranslationMutationMutation = { __typename?: 'Mutation', updateCategoryTranslation: { __typename?: 'CategoryTranslation', name: string, description?: string | null, locale: string } };

export type AllCategories_QueryFragmentFragment = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, slug: string, parentCategoryId?: number | null }> } & { ' $fragmentName'?: 'AllCategories_QueryFragmentFragment' };

export type NewCategoryMutationMutationVariables = Exact<{
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  slug: Scalars['String']['input'];
}>;


export type NewCategoryMutationMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: number } };

export type EditCategoryMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  slug: Scalars['String']['input'];
}>;


export type EditCategoryMutationMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', slug: string, parentCategoryId?: number | null } };

export type CategoriesTable_QueryDocumentQueryVariables = Exact<{
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
}>;


export type CategoriesTable_QueryDocumentQuery = { __typename?: 'Query', paginatedCategories: { __typename?: 'PaginatedCategory', hasNextPage: boolean, totalCount: number, edges?: Array<{ __typename?: 'CategoryEdge', cursor: number, node: { __typename?: 'Category', id: number, slug: string, createdAt: any, updatedAt: any, isSetup: boolean, isPublic: boolean, name?: string | null, productsCount: number, parentCategoryId?: number | null } }> | null } };

export type NewCategory_QueryDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type NewCategory_QueryDocumentQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'AllCategories_QueryFragmentFragment': AllCategories_QueryFragmentFragment;'Locales_QueryFragmentFragment': Locales_QueryFragmentFragment } }
);

export type EditCategory_QueryDocumentQueryVariables = Exact<{
  id: Scalars['Int']['input'];
  productCursor?: InputMaybe<Scalars['Int']['input']>;
  productPageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type EditCategory_QueryDocumentQuery = (
  { __typename?: 'Query', category: { __typename?: 'Category', slug: string, name?: string | null, parentCategoryId?: number | null, isSetup: boolean, isPublic: boolean, productsCount: number, translations: Array<{ __typename?: 'CategoryTranslation', id: number, locale: string, name: string, description?: string | null }>, subcategories: Array<{ __typename?: 'Category', slug: string, id: number }> }, products: { __typename?: 'PaginatedProduct', hasNextPage: boolean, edges?: Array<{ __typename?: 'ProductEdge', cursor: number, node: { __typename?: 'Product', id: number, slug: string, name?: string | null } }> | null }, locales: Array<{ __typename?: 'Locale', code: string, name: string, flag: string }> }
  & { ' $fragmentRefs'?: { 'AllCategories_QueryFragmentFragment': AllCategories_QueryFragmentFragment } }
);

export type Locales_QueryFragmentFragment = { __typename?: 'Query', locales: Array<{ __typename?: 'Locale', code: string, name: string }> } & { ' $fragmentName'?: 'Locales_QueryFragmentFragment' };

export type LocalesQueryDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type LocalesQueryDocumentQuery = (
  { __typename?: 'Query' }
  & { ' $fragmentRefs'?: { 'Locales_QueryFragmentFragment': Locales_QueryFragmentFragment } }
);

export type DeleteProductTranslationMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteProductTranslationMutationMutation = { __typename?: 'Mutation', deleteProductTranslation: number };

export type CreateProductTranslationMutationMutationVariables = Exact<{
  productId: Scalars['Int']['input'];
  localeCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  markdownContent?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateProductTranslationMutationMutation = { __typename?: 'Mutation', createProductTranslation: { __typename?: 'ProductTranslation', name: string, description?: string | null, locale: string } };

export type EditProductTranslationMutationMutationVariables = Exact<{
  translationId: Scalars['Int']['input'];
  localeCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  markdownContent?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditProductTranslationMutationMutation = { __typename?: 'Mutation', editProductTranslation: { __typename?: 'ProductTranslation', name: string, description?: string | null, locale: string } };

export type CreateAttributeKeyMutationMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type CreateAttributeKeyMutationMutation = { __typename?: 'Mutation', createProductVariantAttributeKey: { __typename?: 'ProductVariantAttributeKey', id: number, key: string } };

export type EditAttributeKeyMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  key: Scalars['String']['input'];
}>;


export type EditAttributeKeyMutationMutation = { __typename?: 'Mutation', updateProductVariantAttributeKey: { __typename?: 'ProductVariantAttributeKey', id: number, key: string } };

export type CreateAttributeMutationMutationVariables = Exact<{
  attributeKeyId: Scalars['Int']['input'];
  attributeValue: Scalars['String']['input'];
}>;


export type CreateAttributeMutationMutation = { __typename?: 'Mutation', createProductVariantAttribute: { __typename?: 'ProductVariantAttribute', id: number } };

export type CreateProductMutationMutationVariables = Exact<{
  slug: Scalars['String']['input'];
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  isPublic: Scalars['Boolean']['input'];
}>;


export type CreateProductMutationMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', id: number } };

export type EditProductMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  slug: Scalars['String']['input'];
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  isPublic: Scalars['Boolean']['input'];
}>;


export type EditProductMutationMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', id: number } };

export type AddImageMutationMutationVariables = Exact<{
  productId: Scalars['Int']['input'];
  mimeType: Scalars['String']['input'];
  base64: Scalars['String']['input'];
}>;


export type AddImageMutationMutation = { __typename?: 'Mutation', addProductImage: { __typename?: 'ProductImage', id: number } };

export type AddVariantImageMutationMutationVariables = Exact<{
  productVariantId: Scalars['Int']['input'];
  mimeType: Scalars['String']['input'];
  base64: Scalars['String']['input'];
}>;


export type AddVariantImageMutationMutation = { __typename?: 'Mutation', addProductVariantImage: { __typename?: 'ProductVariantImage', id: number } };

export type SetImageThumbnailMutationMutationVariables = Exact<{
  imageId: Scalars['Int']['input'];
}>;


export type SetImageThumbnailMutationMutation = { __typename?: 'Mutation', setProductThumbnailImage: { __typename?: 'ProductImage', id: number } };

export type SetVariantImageThumbnailMutationMutationVariables = Exact<{
  imageId: Scalars['Int']['input'];
}>;


export type SetVariantImageThumbnailMutationMutation = { __typename?: 'Mutation', setProductVariantThumbnailImage: { __typename?: 'ProductVariantImage', id: number } };

export type DeleteProductImageMutationMutationVariables = Exact<{
  imageId: Scalars['Int']['input'];
}>;


export type DeleteProductImageMutationMutation = { __typename?: 'Mutation', deleteProductImage: number };

export type DeleteVariantImageMutationMutationVariables = Exact<{
  imageId: Scalars['Int']['input'];
}>;


export type DeleteVariantImageMutationMutation = { __typename?: 'Mutation', removeProductVariantImage: number };

export type CreateVariantMutationMutationVariables = Exact<{
  productId: Scalars['Int']['input'];
  sku: Scalars['String']['input'];
  priceInCents: Scalars['Int']['input'];
  isPublic: Scalars['Boolean']['input'];
  stock: Scalars['Int']['input'];
  attributes: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type CreateVariantMutationMutation = { __typename?: 'Mutation', createProductVariant: { __typename?: 'ProductVariant', id: number } };

export type EditVariantMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  sku: Scalars['String']['input'];
  priceInCents: Scalars['Int']['input'];
  isPublic: Scalars['Boolean']['input'];
  stock: Scalars['Int']['input'];
  attributes: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type EditVariantMutationMutation = { __typename?: 'Mutation', updateProductVariant: { __typename?: 'ProductVariant', id: number } };

export type DeleteVariantMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteVariantMutationMutation = { __typename?: 'Mutation', removeProductVariant: number };

export type NewProductPage_QueryDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type NewProductPage_QueryDocumentQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, slug: string }> };

export type ProductDetailPage_QueryDocumentQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ProductDetailPage_QueryDocumentQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, slug: string }>, locales: Array<{ __typename?: 'Locale', flag: string, code: string, name: string }>, productVariantAttributeKeys: Array<{ __typename?: 'ProductVariantAttributeKey', id: number, key: string, attributes: Array<{ __typename?: 'ProductVariantAttribute', id: number, value: string, translations: Array<{ __typename?: 'ProductVariantAttributeTranslation', value: string, locale: string }> }> }>, product?: { __typename?: 'Product', id: number, slug: string, isPublic: boolean, isSetup: boolean, categoryId?: number | null, createdAt: any, updatedAt: any, translations: Array<{ __typename?: 'ProductTranslation', id: number, locale: string, name: string, description?: string | null, markdownContent?: string | null }>, images: Array<{ __typename?: 'ProductImage', id: number, base64: string, mimeType: string, isThumbnail: boolean }>, variants: Array<{ __typename?: 'ProductVariant', id: number, sku: string, priceInCents: number, isPublic: boolean, stock: number, attributes: Array<{ __typename?: 'ProductVariantAttribute', id: number, value: string, key?: { __typename?: 'ProductVariantAttributeKey', id: number, key: string, translations: Array<{ __typename?: 'ProductVariantAttributeKeyTranslation', keyTranslation: string }> } | null, translations: Array<{ __typename?: 'ProductVariantAttributeTranslation', value: string }> }>, images: Array<{ __typename?: 'ProductVariantImage', id: number, base64: string, mimeType: string, isThumbnail: boolean }> }> } | null };

export type ProductsPage_QueryDocumentQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['Int']['input']>;
  pageSize: Scalars['Int']['input'];
  sortBy?: InputMaybe<Scalars['String']['input']>;
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  isSetup?: InputMaybe<Scalars['Boolean']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProductsPage_QueryDocumentQuery = { __typename?: 'Query', products: { __typename?: 'PaginatedProduct', hasNextPage: boolean, edges?: Array<{ __typename?: 'ProductEdge', cursor: number, node: { __typename?: 'Product', id: number, slug: string, isPublic: boolean, isSetup: boolean, categoryId?: number | null, createdAt: any, updatedAt: any } }> | null } };

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

export type CategoryQueryQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  productsCursor?: InputMaybe<Scalars['Int']['input']>;
  productsPageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CategoryQueryQuery = { __typename?: 'Query', category: { __typename?: 'Category', id: number, name?: string | null, slug: string, description: string, subcategories: Array<{ __typename?: 'Category', slug: string, name?: string | null, description: string }>, categoryProductVariants: { __typename?: 'PaginatedProductVariant', hasNextPage: boolean, edges?: Array<{ __typename?: 'ProductVariantEdge', cursor: number, node: { __typename?: 'ProductVariant', sku: string, priceInCents: number, stock: number, product: { __typename?: 'Product', slug: string, name?: string | null, description?: string | null, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null }, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, attributes: Array<{ __typename?: 'ProductVariantAttribute', value: string, translatedValue?: string | null }> } }> | null }, usedProductVariantAttributes: Array<{ __typename?: 'ProductVariantAttribute', id: number, value: string, translatedValue?: string | null, key?: { __typename?: 'ProductVariantAttributeKey', key: string, translatedKey?: string | null } | null }> } };

export type HeaderNav_QueryFragmentFragment = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, name?: string | null, description: string, slug: string, subcategories: Array<{ __typename?: 'Category', id: number, slug: string, name?: string | null }> }> } & { ' $fragmentName'?: 'HeaderNav_QueryFragmentFragment' };

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
export const AllCategories_QueryFragmentFragmentDoc = new TypedDocumentString(`
    fragment AllCategories_QueryFragment on Query {
  categories(parentCategoryId: 0, isPublic: null, isSetup: null) {
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
  categories(parentCategoryId: null) {
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
    mutation DeleteCategoryTranslationMutation($id: Int!) {
  deleteCategoryTranslation(categoryTranslationId: $id)
}
    `) as unknown as TypedDocumentString<DeleteCategoryTranslationMutationMutation, DeleteCategoryTranslationMutationMutationVariables>;
export const NewCategoryTranslationMutationDocument = new TypedDocumentString(`
    mutation NewCategoryTranslationMutation($categoryId: Int!, $localeCode: String!, $name: String!, $description: String) {
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
    mutation EditCategoryTranslationMutation($translationId: Int!, $localeCode: String!, $name: String!, $description: String) {
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
    mutation NewCategoryMutation($parentCategoryId: Int, $slug: String!) {
  createCategory(
    createCategoryInput: {parentCategoryId: $parentCategoryId, slug: $slug}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<NewCategoryMutationMutation, NewCategoryMutationMutationVariables>;
export const EditCategoryMutationDocument = new TypedDocumentString(`
    mutation EditCategoryMutation($id: Int!, $parentCategoryId: Int, $slug: String!) {
  updateCategory(
    updateCategoryInput: {id: $id, parentCategoryId: $parentCategoryId, slug: $slug}
  ) {
    slug
    parentCategoryId
  }
}
    `) as unknown as TypedDocumentString<EditCategoryMutationMutation, EditCategoryMutationMutationVariables>;
export const CategoriesTable_QueryDocumentDocument = new TypedDocumentString(`
    query categoriesTable_QueryDocument($parentCategoryId: Int, $pageSize: Int, $cursor: Int, $slug: String, $id: Int, $isSetup: Boolean, $isPublic: Boolean, $ascending: Boolean, $sortBy: String) {
  paginatedCategories(
    ascending: $ascending
    cursor: $cursor
    pageSize: $pageSize
    isPublic: $isPublic
    isSetup: $isSetup
    idQuery: $id
    slugQuery: $slug
    parentCategoryId: $parentCategoryId
    sortBy: $sortBy
  ) {
    edges {
      cursor
      node {
        id
        slug
        createdAt
        updatedAt
        isSetup
        isPublic
        name
        productsCount
        parentCategoryId
      }
    }
    hasNextPage
    totalCount
  }
}
    `) as unknown as TypedDocumentString<CategoriesTable_QueryDocumentQuery, CategoriesTable_QueryDocumentQueryVariables>;
export const NewCategory_QueryDocumentDocument = new TypedDocumentString(`
    query newCategory_QueryDocument {
  ...AllCategories_QueryFragment
  ...Locales_QueryFragment
}
    fragment AllCategories_QueryFragment on Query {
  categories(parentCategoryId: 0, isPublic: null, isSetup: null) {
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
    query editCategory_QueryDocument($id: Int!, $productCursor: Int, $productPageSize: Int) {
  category(id: $id, isPublic: null, isSetup: null) {
    slug
    name
    parentCategoryId
    isSetup
    isPublic
    productsCount
    translations(locales: []) {
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
  products(
    categoryId: $id
    cursor: $productCursor
    pageSize: $productPageSize
    isPublic: null
    isSetup: null
  ) {
    hasNextPage
    edges {
      cursor
      node {
        id
        slug
        name
      }
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
  categories(parentCategoryId: 0, isPublic: null, isSetup: null) {
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
export const DeleteProductTranslationMutationDocument = new TypedDocumentString(`
    mutation DeleteProductTranslationMutation($id: Int!) {
  deleteProductTranslation(productTranslationId: $id)
}
    `) as unknown as TypedDocumentString<DeleteProductTranslationMutationMutation, DeleteProductTranslationMutationMutationVariables>;
export const CreateProductTranslationMutationDocument = new TypedDocumentString(`
    mutation CreateProductTranslationMutation($productId: Int!, $localeCode: String!, $name: String!, $description: String, $markdownContent: String) {
  createProductTranslation(
    productId: $productId
    createProductTranslationInput: {name: $name, description: $description, localeCode: $localeCode, markdownContent: $markdownContent}
  ) {
    name
    description
    locale
  }
}
    `) as unknown as TypedDocumentString<CreateProductTranslationMutationMutation, CreateProductTranslationMutationMutationVariables>;
export const EditProductTranslationMutationDocument = new TypedDocumentString(`
    mutation EditProductTranslationMutation($translationId: Int!, $localeCode: String!, $name: String!, $description: String, $markdownContent: String) {
  editProductTranslation(
    editProductTranslationInput: {productTranslationId: $translationId, name: $name, description: $description, localeCode: $localeCode, markdownContent: $markdownContent}
  ) {
    name
    description
    locale
  }
}
    `) as unknown as TypedDocumentString<EditProductTranslationMutationMutation, EditProductTranslationMutationMutationVariables>;
export const CreateAttributeKeyMutationDocument = new TypedDocumentString(`
    mutation CreateAttributeKeyMutation($key: String!) {
  createProductVariantAttributeKey(
    createProductVariantAttributeKeyInput: {key: $key}
  ) {
    id
    key
  }
}
    `) as unknown as TypedDocumentString<CreateAttributeKeyMutationMutation, CreateAttributeKeyMutationMutationVariables>;
export const EditAttributeKeyMutationDocument = new TypedDocumentString(`
    mutation EditAttributeKeyMutation($id: Int!, $key: String!) {
  updateProductVariantAttributeKey(
    updateProductVariantAttributeKeyInput: {id: $id, key: $key}
  ) {
    id
    key
  }
}
    `) as unknown as TypedDocumentString<EditAttributeKeyMutationMutation, EditAttributeKeyMutationMutationVariables>;
export const CreateAttributeMutationDocument = new TypedDocumentString(`
    mutation CreateAttributeMutation($attributeKeyId: Int!, $attributeValue: String!) {
  createProductVariantAttribute(
    createProductVariantAttributeInput: {keyId: $attributeKeyId, value: $attributeValue}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateAttributeMutationMutation, CreateAttributeMutationMutationVariables>;
export const CreateProductMutationDocument = new TypedDocumentString(`
    mutation CreateProductMutation($slug: String!, $categoryId: Int, $isPublic: Boolean!) {
  createProduct(
    createProductInput: {slug: $slug, categoryId: $categoryId, isPublic: $isPublic}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateProductMutationMutation, CreateProductMutationMutationVariables>;
export const EditProductMutationDocument = new TypedDocumentString(`
    mutation EditProductMutation($id: Int!, $slug: String!, $categoryId: Int, $isPublic: Boolean!) {
  updateProduct(
    updateProductInput: {id: $id, slug: $slug, categoryId: $categoryId, isPublic: $isPublic}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<EditProductMutationMutation, EditProductMutationMutationVariables>;
export const AddImageMutationDocument = new TypedDocumentString(`
    mutation AddImageMutation($productId: Int!, $mimeType: String!, $base64: String!) {
  addProductImage(productId: $productId, mimeType: $mimeType, base64: $base64) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddImageMutationMutation, AddImageMutationMutationVariables>;
export const AddVariantImageMutationDocument = new TypedDocumentString(`
    mutation AddVariantImageMutation($productVariantId: Int!, $mimeType: String!, $base64: String!) {
  addProductVariantImage(
    productVariantId: $productVariantId
    mimeType: $mimeType
    base64: $base64
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<AddVariantImageMutationMutation, AddVariantImageMutationMutationVariables>;
export const SetImageThumbnailMutationDocument = new TypedDocumentString(`
    mutation SetImageThumbnailMutation($imageId: Int!) {
  setProductThumbnailImage(productImageId: $imageId) {
    id
  }
}
    `) as unknown as TypedDocumentString<SetImageThumbnailMutationMutation, SetImageThumbnailMutationMutationVariables>;
export const SetVariantImageThumbnailMutationDocument = new TypedDocumentString(`
    mutation SetVariantImageThumbnailMutation($imageId: Int!) {
  setProductVariantThumbnailImage(id: $imageId) {
    id
  }
}
    `) as unknown as TypedDocumentString<SetVariantImageThumbnailMutationMutation, SetVariantImageThumbnailMutationMutationVariables>;
export const DeleteProductImageMutationDocument = new TypedDocumentString(`
    mutation DeleteProductImageMutation($imageId: Int!) {
  deleteProductImage(productImageId: $imageId)
}
    `) as unknown as TypedDocumentString<DeleteProductImageMutationMutation, DeleteProductImageMutationMutationVariables>;
export const DeleteVariantImageMutationDocument = new TypedDocumentString(`
    mutation DeleteVariantImageMutation($imageId: Int!) {
  removeProductVariantImage(id: $imageId)
}
    `) as unknown as TypedDocumentString<DeleteVariantImageMutationMutation, DeleteVariantImageMutationMutationVariables>;
export const CreateVariantMutationDocument = new TypedDocumentString(`
    mutation CreateVariantMutation($productId: Int!, $sku: String!, $priceInCents: Int!, $isPublic: Boolean!, $stock: Int!, $attributes: [Int!]!) {
  createProductVariant(
    createProductVariantInput: {productId: $productId, sku: $sku, priceInCents: $priceInCents, isPublic: $isPublic, stock: $stock, attributes: $attributes}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateVariantMutationMutation, CreateVariantMutationMutationVariables>;
export const EditVariantMutationDocument = new TypedDocumentString(`
    mutation EditVariantMutation($id: Int!, $sku: String!, $priceInCents: Int!, $isPublic: Boolean!, $stock: Int!, $attributes: [Int!]!) {
  updateProductVariant(
    updateProductVariantInput: {id: $id, sku: $sku, priceInCents: $priceInCents, isPublic: $isPublic, stock: $stock, attributes: $attributes}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<EditVariantMutationMutation, EditVariantMutationMutationVariables>;
export const DeleteVariantMutationDocument = new TypedDocumentString(`
    mutation DeleteVariantMutation($id: Int!) {
  removeProductVariant(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteVariantMutationMutation, DeleteVariantMutationMutationVariables>;
export const NewProductPage_QueryDocumentDocument = new TypedDocumentString(`
    query NewProductPage_QueryDocument {
  categories(isPublic: null, isSetup: null) {
    id
    slug
  }
}
    `) as unknown as TypedDocumentString<NewProductPage_QueryDocumentQuery, NewProductPage_QueryDocumentQueryVariables>;
export const ProductDetailPage_QueryDocumentDocument = new TypedDocumentString(`
    query ProductDetailPage_QueryDocument($id: Int!) {
  categories(isPublic: null, isSetup: null) {
    id
    slug
  }
  locales {
    flag
    code
    name
  }
  productVariantAttributeKeys(productId: null) {
    id
    key
    attributes {
      id
      value
      translations {
        value
        locale
      }
    }
  }
  product(id: $id, isPublic: null, isSetup: null) {
    id
    slug
    isPublic
    isSetup
    categoryId
    createdAt
    updatedAt
    translations {
      id
      locale
      name
      description
      markdownContent
    }
    images {
      id
      base64
      mimeType
      isThumbnail
    }
    variants(includeHidden: true) {
      id
      sku
      priceInCents
      isPublic
      stock
      attributes {
        id
        value
        key {
          id
          key
          translations {
            keyTranslation
          }
        }
        translations {
          value
        }
      }
      images {
        id
        base64
        mimeType
        isThumbnail
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ProductDetailPage_QueryDocumentQuery, ProductDetailPage_QueryDocumentQueryVariables>;
export const ProductsPage_QueryDocumentDocument = new TypedDocumentString(`
    query ProductsPage_QueryDocument($cursor: Int, $pageSize: Int!, $sortBy: String, $ascending: Boolean, $slug: String, $isSetup: Boolean, $isPublic: Boolean, $categoryId: Int) {
  products(
    cursor: $cursor
    pageSize: $pageSize
    sortBy: $sortBy
    ascending: $ascending
    slug: $slug
    isSetup: $isSetup
    isPublic: $isPublic
    categoryId: $categoryId
  ) {
    hasNextPage
    edges {
      node {
        id
        slug
        isPublic
        isSetup
        categoryId
        createdAt
        updatedAt
      }
      cursor
    }
  }
}
    `) as unknown as TypedDocumentString<ProductsPage_QueryDocumentQuery, ProductsPage_QueryDocumentQueryVariables>;
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
  categories(parentCategoryId: null) {
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
export const CategoryQueryDocument = new TypedDocumentString(`
    query CategoryQuery($slug: String!, $productsCursor: Int, $productsPageSize: Int) {
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
    categoryProductVariants(
      cursor: $productsCursor
      pageSize: $productsPageSize
      includeSubcategories: true
    ) {
      hasNextPage
      edges {
        cursor
        node {
          product {
            slug
            thumbnailImage {
              base64
              mimeType
            }
            name
            description
          }
          sku
          thumbnailImage {
            base64
            mimeType
          }
          priceInCents
          stock
          attributes {
            value
            translatedValue
          }
        }
      }
    }
    usedProductVariantAttributes {
      id
      value
      translatedValue
      key {
        key
        translatedKey
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CategoryQueryQuery, CategoryQueryQueryVariables>;