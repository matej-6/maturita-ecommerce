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

export enum AttributeKeySortingField {
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  Key = 'KEY',
  UpdatedAt = 'UPDATED_AT'
}

export type BestSellingCategory = {
  __typename?: 'BestSellingCategory';
  category: Category;
  itemsSold: Scalars['Int']['output'];
  totalRevenueInCents: Scalars['Float']['output'];
};

export type BestSellingProductVariant = {
  __typename?: 'BestSellingProductVariant';
  productVariant: ProductVariant;
  quantitySold: Scalars['Int']['output'];
};

export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  items: Array<CartItem>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  cartId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  productVariant: ProductVariant;
  productVariantId: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
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

export type CreateLlmPromptInput = {
  productId?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
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

export type CreateProductVariantAttributeKeyTranslationInput = {
  keyId: Scalars['Int']['input'];
  keyTranslation: Scalars['String']['input'];
  localeCode: Scalars['String']['input'];
};

export type CreateProductVariantAttributeTranslationInput = {
  attributeId: Scalars['Int']['input'];
  locale: Scalars['String']['input'];
  valueTranslation: Scalars['String']['input'];
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

export type DataPoint = {
  __typename?: 'DataPoint';
  label: Scalars['String']['output'];
  x: Scalars['String']['output'];
  y: Scalars['String']['output'];
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

export enum EmbeddingTaskStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type LlmTask = {
  __typename?: 'LLMTask';
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  prompt: Scalars['String']['output'];
  response?: Maybe<UserPromptResponse>;
  status: LlmTaskStatus;
  userId: Scalars['Int']['output'];
};

export enum LlmTaskStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type Locale = {
  __typename?: 'Locale';
  /** Locale code */
  code: Scalars['String']['output'];
  flag: Scalars['String']['output'];
  /** Native locale name */
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addItemToCart: Cart;
  addNoteToOrder: Scalars['Void']['output'];
  addProductImage: ProductImage;
  addProductVariantImage: ProductVariantImage;
  cancelOrder: Order;
  changePassword: Scalars['Void']['output'];
  createCategory: Category;
  createCategoryTranslation: CategoryTranslation;
  createLlmTask: LlmTask;
  createProduct: Product;
  createProductTranslation: ProductTranslation;
  createProductVariant: ProductVariant;
  createProductVariantAttribute: ProductVariantAttribute;
  createProductVariantAttributeKey: ProductVariantAttributeKey;
  createProductVariantAttributeKeyTranslation: ProductVariantAttributeKeyTranslation;
  createProductVariantAttributeTranslation: ProductVariantAttributeTranslation;
  deleteAccount?: Maybe<Scalars['Void']['output']>;
  deleteAvatar: Scalars['Void']['output'];
  deleteCategoryTranslation: Scalars['Int']['output'];
  deleteProductImage: Scalars['Int']['output'];
  deleteProductTranslation: Scalars['Int']['output'];
  editProductTranslation: ProductTranslation;
  generateProductContentEmbedding?: Maybe<ProductContentEmbedding>;
  generateProductEmbedding?: Maybe<ProductEmbedding>;
  logoutAll: Scalars['Void']['output'];
  regenerateAllProductContentEmbeddings: Scalars['Void']['output'];
  regenerateAllProductEmbeddings: Scalars['Void']['output'];
  removeCategory: Category;
  removeProduct: Product;
  removeProductVariant: Scalars['Int']['output'];
  removeProductVariantAttribute: Scalars['Void']['output'];
  removeProductVariantAttributeKey: Scalars['Void']['output'];
  removeProductVariantAttributeKeyTranslation: Scalars['Void']['output'];
  removeProductVariantAttributeTranslation: Scalars['Void']['output'];
  removeProductVariantImage: Scalars['Int']['output'];
  removeUser: User;
  retryPendingPayment: Scalars['String']['output'];
  setProductThumbnailImage: ProductImage;
  setProductVariantThumbnailImage: ProductVariantImage;
  updateCartItemQuantity: Cart;
  updateCategory: Category;
  updateCategoryTranslation: CategoryTranslation;
  updateOrder: Scalars['Boolean']['output'];
  updatePassword: Scalars['Void']['output'];
  updateProduct: Product;
  updateProductVariant: ProductVariant;
  updateProductVariantAttribute: ProductVariantAttribute;
  updateProductVariantAttributeKey: ProductVariantAttributeKey;
  updateProductVariantAttributeKeyTranslation: ProductVariantAttributeKeyTranslation;
  updateProductVariantAttributeTranslation: ProductVariantAttributeTranslation;
  updateUser: User;
  updateUserRole: Scalars['Void']['output'];
  uploadAvatar: Scalars['Void']['output'];
};


export type MutationAddItemToCartArgs = {
  productVariantId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationAddNoteToOrderArgs = {
  note: Scalars['String']['input'];
  orderId: Scalars['Int']['input'];
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


export type MutationCancelOrderArgs = {
  id: Scalars['Int']['input'];
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
};


export type MutationCreateCategoryTranslationArgs = {
  newTranslationinput: CreateCategoryTranslationInput;
};


export type MutationCreateLlmTaskArgs = {
  input: CreateLlmPromptInput;
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


export type MutationCreateProductVariantAttributeKeyTranslationArgs = {
  input: CreateProductVariantAttributeKeyTranslationInput;
};


export type MutationCreateProductVariantAttributeTranslationArgs = {
  input: CreateProductVariantAttributeTranslationInput;
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


export type MutationGenerateProductContentEmbeddingArgs = {
  lang: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationGenerateProductEmbeddingArgs = {
  lang: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
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


export type MutationRemoveProductVariantAttributeKeyTranslationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveProductVariantAttributeTranslationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveProductVariantImageArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRetryPendingPaymentArgs = {
  orderId: Scalars['Int']['input'];
};


export type MutationSetProductThumbnailImageArgs = {
  productImageId: Scalars['Int']['input'];
};


export type MutationSetProductVariantThumbnailImageArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateCartItemQuantityArgs = {
  cartItemId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationUpdateCategoryArgs = {
  updateCategoryInput: UpdateCategoryInput;
};


export type MutationUpdateCategoryTranslationArgs = {
  editTranslationInput: EditCategoryTranslationInput;
};


export type MutationUpdateOrderArgs = {
  input: UpdateOrderDto;
  orderId: Scalars['Int']['input'];
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput;
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


export type MutationUpdateProductVariantAttributeKeyTranslationArgs = {
  input: UpdateProductVariantAttributeKeyTranslationInput;
};


export type MutationUpdateProductVariantAttributeTranslationArgs = {
  input: UpdateProductVariantAttributeTranslationInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserRoleArgs = {
  newRole: Role;
  userId: Scalars['Int']['input'];
};


export type MutationUploadAvatarArgs = {
  base64: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  items: Array<OrderItem>;
  shippingDetails?: Maybe<OrderShippingDetails>;
  status: OrderStatus;
  totalInCents: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
  userNote?: Maybe<Scalars['String']['output']>;
};

export type OrderEdge = {
  __typename?: 'OrderEdge';
  cursor: Scalars['Int']['output'];
  node: Order;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  orderId: Scalars['Int']['output'];
  productVariant?: Maybe<ProductVariant>;
  productVariantId?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Int']['output'];
  sku: Scalars['String']['output'];
  unitPriceInCents: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderShippingDetails = {
  __typename?: 'OrderShippingDetails';
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  line1: Scalars['String']['output'];
  line2?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  orderId: Scalars['Int']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum OrderStatus {
  Canceled = 'CANCELED',
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED'
}

export type OverallTrendStatistic = {
  __typename?: 'OverallTrendStatistic';
  percentChange: Scalars['Float']['output'];
  points: Array<DataPoint>;
  timePeriod: TimePeriod;
};

export type PaginatedCategory = {
  __typename?: 'PaginatedCategory';
  edges?: Maybe<Array<CategoryEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginatedOrder = {
  __typename?: 'PaginatedOrder';
  edges?: Maybe<Array<OrderEdge>>;
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

export type PaginatedProductVariantAttributeKey = {
  __typename?: 'PaginatedProductVariantAttributeKey';
  edges?: Maybe<Array<ProductVariantAttributeKeyEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginatedUser = {
  __typename?: 'PaginatedUser';
  edges?: Maybe<Array<UserEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  categoryId?: Maybe<Scalars['Int']['output']>;
  contentEmbeddings: Array<ProductContentEmbedding>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  embeddings: Array<ProductEmbedding>;
  /** Product ID */
  id: Scalars['Int']['output'];
  images: Array<ProductImage>;
  isPublic: Scalars['Boolean']['output'];
  isSetup: Scalars['Boolean']['output'];
  markdownContent?: Maybe<Scalars['String']['output']>;
  missingContentEmbeddingLanguages: Array<Scalars['String']['output']>;
  missingEmbeddingLanguages: Array<Scalars['String']['output']>;
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

export type ProductContentEmbedding = {
  __typename?: 'ProductContentEmbedding';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  lang: Scalars['String']['output'];
  productId: Scalars['Int']['output'];
  status: EmbeddingTaskStatus;
};

export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['Int']['output'];
  node: Product;
};

export type ProductEmbedding = {
  __typename?: 'ProductEmbedding';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  lang: Scalars['String']['output'];
  productId: Scalars['Int']['output'];
  status: EmbeddingTaskStatus;
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
  productVariants: Array<ProductVariant>;
  translatedValue?: Maybe<Scalars['String']['output']>;
  translations: Array<ProductVariantAttributeTranslation>;
  value: Scalars['String']['output'];
};

export type ProductVariantAttributeKey = {
  __typename?: 'ProductVariantAttributeKey';
  attributes: Array<ProductVariantAttribute>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  translatedKey?: Maybe<Scalars['String']['output']>;
  translations: Array<ProductVariantAttributeKeyTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariantAttributeKeyEdge = {
  __typename?: 'ProductVariantAttributeKeyEdge';
  cursor: Scalars['Int']['output'];
  node: ProductVariantAttributeKey;
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
  bestSellingCategoriesStatistic?: Maybe<Array<BestSellingCategory>>;
  bestSellingProductVariantsStatistic?: Maybe<Array<BestSellingProductVariant>>;
  cart: Cart;
  categories: Array<Category>;
  category: Category;
  findAllPaginatedOrders: PaginatedOrder;
  findAllPaginatedProductVariantAttributeKeys: PaginatedProductVariantAttributeKey;
  findAllPaginatedUsers: PaginatedUser;
  findOneProductVariantAttribute?: Maybe<ProductVariantAttribute>;
  findOrderById?: Maybe<Order>;
  getUserLLMTaskById?: Maybe<LlmTask>;
  locale: Locale;
  locales: Array<Locale>;
  me: User;
  missingProductContentEmbeddingLanguages: Array<Scalars['String']['output']>;
  missingProductEmbeddingLanguages: Array<Scalars['String']['output']>;
  order?: Maybe<Order>;
  orders: Array<Order>;
  paginatedCategories: PaginatedCategory;
  product?: Maybe<Product>;
  productBySlug?: Maybe<Product>;
  productContentEmbedding?: Maybe<ProductContentEmbedding>;
  productContentEmbeddings: Array<ProductContentEmbedding>;
  productEmbedding?: Maybe<ProductEmbedding>;
  productEmbeddings: Array<ProductEmbedding>;
  productVariantAttributeKey: ProductVariantAttributeKey;
  productVariantAttributeKeys: Array<ProductVariantAttributeKey>;
  productVariantAttributes: Array<ProductVariantAttribute>;
  productVariantsByIds: Array<ProductVariant>;
  products: PaginatedProduct;
  revenuePerDayStatistic?: Maybe<OverallTrendStatistic>;
  searchProductVariants: PaginatedProductVariant;
  user: User;
};


export type QueryBestSellingCategoriesStatisticArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  timePeriod: TimePeriod;
};


export type QueryBestSellingProductVariantsStatisticArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  timePeriod: TimePeriod;
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


export type QueryFindAllPaginatedOrdersArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFindAllPaginatedProductVariantAttributeKeysArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<AttributeKeySortingField>;
};


export type QueryFindAllPaginatedUsersArgs = {
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Role>;
  sortBy?: InputMaybe<UserSortingField>;
};


export type QueryFindOneProductVariantAttributeArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindOrderByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetUserLlmTaskByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryLocaleArgs = {
  id: Scalars['String']['input'];
};


export type QueryMissingProductContentEmbeddingLanguagesArgs = {
  productId: Scalars['Int']['input'];
};


export type QueryMissingProductEmbeddingLanguagesArgs = {
  productId: Scalars['Int']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['Int']['input'];
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


export type QueryProductBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryProductContentEmbeddingArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductContentEmbeddingsArgs = {
  productId: Scalars['Int']['input'];
};


export type QueryProductEmbeddingArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductEmbeddingsArgs = {
  productId: Scalars['Int']['input'];
};


export type QueryProductVariantAttributeKeyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductVariantAttributeKeysArgs = {
  productId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductVariantsByIdsArgs = {
  ids: Array<Scalars['Int']['input']>;
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


export type QueryRevenuePerDayStatisticArgs = {
  timePeriod: TimePeriod;
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
  User = 'USER'
}

export enum TimePeriod {
  LastNinetyDays = 'LAST_NINETY_DAYS',
  LastSevenDays = 'LAST_SEVEN_DAYS',
  LastThirtyDays = 'LAST_THIRTY_DAYS'
}

export type UpdateCategoryInput = {
  /** Category id */
  id: Scalars['Int']['input'];
  /** Parent category id */
  parentCategoryId?: InputMaybe<Scalars['Int']['input']>;
  /** Slug of the category */
  slug: Scalars['String']['input'];
};

export type UpdateOrderDto = {
  status: OrderStatus;
};

export type UpdatePasswordInput = {
  confirmNewPassword: Scalars['String']['input'];
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
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

export type UpdateProductVariantAttributeKeyTranslationInput = {
  id: Scalars['Int']['input'];
  keyTranslation: Scalars['String']['input'];
  localeCode: Scalars['String']['input'];
};

export type UpdateProductVariantAttributeTranslationInput = {
  id: Scalars['Int']['input'];
  locale: Scalars['String']['input'];
  valueTranslation: Scalars['String']['input'];
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
  lastName: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<UserAvatar>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  orders: Array<Order>;
  role: Role;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserAvatar = {
  __typename?: 'UserAvatar';
  base64: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  mimeType: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['Int']['output'];
  node: User;
};

export type UserPromptResponse = {
  __typename?: 'UserPromptResponse';
  id: Scalars['Int']['output'];
  products?: Maybe<Array<Product>>;
  text: Scalars['String']['output'];
};

export enum UserSortingField {
  CreatedAt = 'CREATED_AT',
  Email = 'EMAIL',
  Id = 'ID',
  Role = 'ROLE',
  UpdatedAt = 'UPDATED_AT'
}

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

export type AdminUpdateOrderMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  newStatus: OrderStatus;
}>;


export type AdminUpdateOrderMutation = { __typename?: 'Mutation', updateOrder: boolean };

export type AdminOrdersPage_QueryDocumentQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['Int']['input']>;
  pageSize: Scalars['Int']['input'];
  sortBy?: InputMaybe<Scalars['String']['input']>;
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<OrderStatus>;
  id?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type AdminOrdersPage_QueryDocumentQuery = { __typename?: 'Query', findAllPaginatedOrders: { __typename?: 'PaginatedOrder', hasNextPage: boolean, edges?: Array<{ __typename?: 'OrderEdge', cursor: number, node: { __typename?: 'Order', id: number, totalInCents: number, status: OrderStatus, createdAt: any, updatedAt: any, userId?: number | null } }> | null } };

export type AdminOrderDetailPageQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type AdminOrderDetailPageQuery = { __typename?: 'Query', findOrderById?: { __typename?: 'Order', id: number, updatedAt: any, createdAt: any, status: OrderStatus, totalInCents: number, shippingDetails?: { __typename?: 'OrderShippingDetails', city?: string | null, country: string, state?: string | null, line1: string, line2?: string | null, postalCode: string, phone?: string | null } | null, items: Array<{ __typename?: 'OrderItem', productVariantId?: number | null, sku: string, unitPriceInCents: number, quantity: number, productVariant?: { __typename?: 'ProductVariant', id: number, sku: string, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, product: { __typename?: 'Product', id: number, slug: string, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } | null }> } | null };

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

export type DeleteAttributeKeyMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAttributeKeyMutationMutation = { __typename?: 'Mutation', removeProductVariantAttributeKey: any };

export type CreateAttributeMutationMutationVariables = Exact<{
  attributeKeyId: Scalars['Int']['input'];
  attributeValue: Scalars['String']['input'];
}>;


export type CreateAttributeMutationMutation = { __typename?: 'Mutation', createProductVariantAttribute: { __typename?: 'ProductVariantAttribute', id: number } };

export type UpdateAttributeMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  attributeValue: Scalars['String']['input'];
}>;


export type UpdateAttributeMutationMutation = { __typename?: 'Mutation', updateProductVariantAttribute: { __typename?: 'ProductVariantAttribute', id: number } };

export type DeleteAttributeMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAttributeMutationMutation = { __typename?: 'Mutation', removeProductVariantAttribute: any };

export type CreateAttributeKeyTranslationMutationMutationVariables = Exact<{
  attributeKeyId: Scalars['Int']['input'];
  keyTranslation: Scalars['String']['input'];
  locale: Scalars['String']['input'];
}>;


export type CreateAttributeKeyTranslationMutationMutation = { __typename?: 'Mutation', createProductVariantAttributeKeyTranslation: { __typename?: 'ProductVariantAttributeKeyTranslation', id: number } };

export type DeleteAttributeKeyTranslationMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAttributeKeyTranslationMutationMutation = { __typename?: 'Mutation', removeProductVariantAttributeKeyTranslation: any };

export type DeleteAttributeTranslationMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAttributeTranslationMutationMutation = { __typename?: 'Mutation', removeProductVariantAttributeTranslation: any };

export type UpdateAttributeKeyTranslationMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  keyTranslation: Scalars['String']['input'];
  locale: Scalars['String']['input'];
}>;


export type UpdateAttributeKeyTranslationMutationMutation = { __typename?: 'Mutation', updateProductVariantAttributeKeyTranslation: { __typename?: 'ProductVariantAttributeKeyTranslation', id: number } };

export type CreateProductVariantAttributeTranslationMutationVariables = Exact<{
  attributeId: Scalars['Int']['input'];
  valueTranslation: Scalars['String']['input'];
  locale: Scalars['String']['input'];
}>;


export type CreateProductVariantAttributeTranslationMutation = { __typename?: 'Mutation', createProductVariantAttributeTranslation: { __typename?: 'ProductVariantAttributeTranslation', id: number } };

export type UpdateProductVariantAttributeTranslationMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  valueTranslation: Scalars['String']['input'];
  locale: Scalars['String']['input'];
}>;


export type UpdateProductVariantAttributeTranslationMutationMutation = { __typename?: 'Mutation', updateProductVariantAttributeTranslation: { __typename?: 'ProductVariantAttributeTranslation', id: number } };

export type DeleteProductVariantAttributeTranslationMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteProductVariantAttributeTranslationMutationMutation = { __typename?: 'Mutation', removeProductVariantAttributeTranslation: any };

export type PagedAttributeKeysQueryQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['Int']['input']>;
  pageSize: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<AttributeKeySortingField>;
}>;


export type PagedAttributeKeysQueryQuery = { __typename?: 'Query', findAllPaginatedProductVariantAttributeKeys: { __typename?: 'PaginatedProductVariantAttributeKey', hasNextPage: boolean, totalCount: number, edges?: Array<{ __typename?: 'ProductVariantAttributeKeyEdge', cursor: number, node: { __typename?: 'ProductVariantAttributeKey', id: number, key: string, createdAt: any, updatedAt: any, attributes: Array<{ __typename?: 'ProductVariantAttribute', id: number }> } }> | null } };

export type AdminAttributeKeyDetailsPageQueryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type AdminAttributeKeyDetailsPageQueryQuery = { __typename?: 'Query', productVariantAttributeKey: { __typename?: 'ProductVariantAttributeKey', id: number, key: string, createdAt: any, updatedAt: any, attributes: Array<{ __typename?: 'ProductVariantAttribute', id: number, value: string, productVariants: Array<{ __typename?: 'ProductVariant', id: number, sku: string, productId: number }>, translations: Array<{ __typename?: 'ProductVariantAttributeTranslation', id: number, locale: string, value: string }> }>, translations: Array<{ __typename?: 'ProductVariantAttributeKeyTranslation', id: number, keyTranslation: string, locale: string }> }, locales: Array<{ __typename?: 'Locale', code: string, name: string, flag: string }> };

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

export type GenerateProductEmbeddingMutationMutationVariables = Exact<{
  productId: Scalars['Int']['input'];
  lang: Scalars['String']['input'];
}>;


export type GenerateProductEmbeddingMutationMutation = { __typename?: 'Mutation', generateProductEmbedding?: { __typename?: 'ProductEmbedding', id: number, status: EmbeddingTaskStatus, createdAt: any } | null };

export type GenerateProductContentEmbeddingMutationMutationVariables = Exact<{
  productId: Scalars['Int']['input'];
  lang: Scalars['String']['input'];
}>;


export type GenerateProductContentEmbeddingMutationMutation = { __typename?: 'Mutation', generateProductContentEmbedding?: { __typename?: 'ProductContentEmbedding', id: number, status: EmbeddingTaskStatus, createdAt: any } | null };

export type RegenerateAllProductEmbeddingsMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type RegenerateAllProductEmbeddingsMutationMutation = { __typename?: 'Mutation', regenerateAllProductEmbeddings: any };

export type RegenerateAllProductContentEmbeddingsMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type RegenerateAllProductContentEmbeddingsMutationMutation = { __typename?: 'Mutation', regenerateAllProductContentEmbeddings: any };

export type NewProductPage_QueryDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type NewProductPage_QueryDocumentQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, slug: string }> };

export type ProductDetailPage_QueryDocumentQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ProductDetailPage_QueryDocumentQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, slug: string }>, locales: Array<{ __typename?: 'Locale', flag: string, code: string, name: string }>, productVariantAttributeKeys: Array<{ __typename?: 'ProductVariantAttributeKey', id: number, key: string, attributes: Array<{ __typename?: 'ProductVariantAttribute', id: number, value: string, translations: Array<{ __typename?: 'ProductVariantAttributeTranslation', value: string, locale: string }> }> }>, product?: { __typename?: 'Product', id: number, slug: string, isPublic: boolean, isSetup: boolean, categoryId?: number | null, createdAt: any, updatedAt: any, missingEmbeddingLanguages: Array<string>, missingContentEmbeddingLanguages: Array<string>, embeddings: Array<{ __typename?: 'ProductEmbedding', id: number, lang: string, createdAt: any, status: EmbeddingTaskStatus }>, contentEmbeddings: Array<{ __typename?: 'ProductContentEmbedding', id: number, lang: string, createdAt: any, status: EmbeddingTaskStatus }>, translations: Array<{ __typename?: 'ProductTranslation', id: number, locale: string, name: string, description?: string | null, markdownContent?: string | null }>, images: Array<{ __typename?: 'ProductImage', id: number, base64: string, mimeType: string, isThumbnail: boolean }>, variants: Array<{ __typename?: 'ProductVariant', id: number, sku: string, priceInCents: number, isPublic: boolean, stock: number, attributes: Array<{ __typename?: 'ProductVariantAttribute', id: number, value: string, key?: { __typename?: 'ProductVariantAttributeKey', id: number, key: string, translations: Array<{ __typename?: 'ProductVariantAttributeKeyTranslation', keyTranslation: string }> } | null, translations: Array<{ __typename?: 'ProductVariantAttributeTranslation', value: string }> }>, images: Array<{ __typename?: 'ProductVariantImage', id: number, base64: string, mimeType: string, isThumbnail: boolean }> }> } | null };

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

export type RevenuePerDayLastNinetyDaysFragmentFragment = { __typename?: 'Query', revenuePerDayStatistic?: { __typename?: 'OverallTrendStatistic', percentChange: number, timePeriod: TimePeriod, points: Array<{ __typename?: 'DataPoint', x: string, y: string, label: string }> } | null } & { ' $fragmentName'?: 'RevenuePerDayLastNinetyDaysFragmentFragment' };

export type RevenuePerDayLastSevenDaysFragmentFragment = { __typename?: 'Query', revenuePerDayStatistic?: { __typename?: 'OverallTrendStatistic', percentChange: number, timePeriod: TimePeriod, points: Array<{ __typename?: 'DataPoint', x: string, y: string, label: string }> } | null } & { ' $fragmentName'?: 'RevenuePerDayLastSevenDaysFragmentFragment' };

export type BestSellingCategoriesStatisticLastSevenDaysFragmentFragment = { __typename?: 'Query', bestSellingCategoriesStatistic?: Array<{ __typename?: 'BestSellingCategory', itemsSold: number, totalRevenueInCents: number, category: { __typename?: 'Category', id: number, slug: string } }> | null } & { ' $fragmentName'?: 'BestSellingCategoriesStatisticLastSevenDaysFragmentFragment' };

export type BestSellingProductVariantsStatisticLastSevenDaysFragmentFragment = { __typename?: 'Query', bestSellingProductVariantsStatistic?: Array<{ __typename?: 'BestSellingProductVariant', quantitySold: number, productVariant: { __typename?: 'ProductVariant', id: number, sku: string, product: { __typename?: 'Product', id: number, name?: string | null, slug: string } } }> | null } & { ' $fragmentName'?: 'BestSellingProductVariantsStatisticLastSevenDaysFragmentFragment' };

export type BestSellingCategoriesStatisticLastThirtyDaysFragmentFragment = { __typename?: 'Query', bestSellingCategoriesStatistic?: Array<{ __typename?: 'BestSellingCategory', itemsSold: number, totalRevenueInCents: number, category: { __typename?: 'Category', id: number, slug: string } }> | null } & { ' $fragmentName'?: 'BestSellingCategoriesStatisticLastThirtyDaysFragmentFragment' };

export type BestSellingProductVariantsStatisticLastThirtyDaysFragmentFragment = { __typename?: 'Query', bestSellingProductVariantsStatistic?: Array<{ __typename?: 'BestSellingProductVariant', quantitySold: number, productVariant: { __typename?: 'ProductVariant', id: number, sku: string, product: { __typename?: 'Product', id: number, name?: string | null, slug: string } } }> | null } & { ' $fragmentName'?: 'BestSellingProductVariantsStatisticLastThirtyDaysFragmentFragment' };

export type BestSellingCategoriesStatisticLastNinetyDaysFragmentFragment = { __typename?: 'Query', bestSellingCategoriesStatistic?: Array<{ __typename?: 'BestSellingCategory', itemsSold: number, totalRevenueInCents: number, category: { __typename?: 'Category', id: number, slug: string } }> | null } & { ' $fragmentName'?: 'BestSellingCategoriesStatisticLastNinetyDaysFragmentFragment' };

export type BestSellingProductVariantsStatisticLastNinetyDaysFragmentFragment = { __typename?: 'Query', bestSellingProductVariantsStatistic?: Array<{ __typename?: 'BestSellingProductVariant', quantitySold: number, productVariant: { __typename?: 'ProductVariant', id: number, sku: string, product: { __typename?: 'Product', id: number, name?: string | null, slug: string } } }> | null } & { ' $fragmentName'?: 'BestSellingProductVariantsStatisticLastNinetyDaysFragmentFragment' };

export type AdminPageStatisticsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminPageStatisticsQuery = { __typename?: 'Query', BestSellingCategoriesStatisticLastSevenDays?: Array<{ __typename?: 'BestSellingCategory', itemsSold: number, totalRevenueInCents: number, category: { __typename?: 'Category', id: number, slug: string } }> | null, BestSellingCategoriesStatisticLastThirtyDaysFragment?: Array<{ __typename?: 'BestSellingCategory', itemsSold: number, totalRevenueInCents: number, category: { __typename?: 'Category', id: number, slug: string } }> | null, BestSellingCategoriesStatisticLastNinetyDaysFragment?: Array<{ __typename?: 'BestSellingCategory', itemsSold: number, totalRevenueInCents: number, category: { __typename?: 'Category', id: number, slug: string } }> | null, RevenuePerDayLastNinetyDaysFragment?: { __typename?: 'OverallTrendStatistic', percentChange: number, timePeriod: TimePeriod, points: Array<{ __typename?: 'DataPoint', x: string, y: string, label: string }> } | null, RevenuePerDayLastSevenDaysFragment?: { __typename?: 'OverallTrendStatistic', percentChange: number, timePeriod: TimePeriod, points: Array<{ __typename?: 'DataPoint', x: string, y: string, label: string }> } | null, RevenuePerDayLastThirtyDaysFragment?: { __typename?: 'OverallTrendStatistic', percentChange: number, timePeriod: TimePeriod, points: Array<{ __typename?: 'DataPoint', x: string, y: string, label: string }> } | null, BestSellingProductVariantsStatisticLastSevenDaysFragment?: Array<{ __typename?: 'BestSellingProductVariant', quantitySold: number, productVariant: { __typename?: 'ProductVariant', id: number, sku: string, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, product: { __typename?: 'Product', id: number, slug: string, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } }> | null, BestSellingProductVariantsStatisticLastThirtyDaysFragment?: Array<{ __typename?: 'BestSellingProductVariant', quantitySold: number, productVariant: { __typename?: 'ProductVariant', id: number, sku: string, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, product: { __typename?: 'Product', id: number, slug: string, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } }> | null, BestSellingProductVariantsStatisticLastNinetyDaysFragment?: Array<{ __typename?: 'BestSellingProductVariant', quantitySold: number, productVariant: { __typename?: 'ProductVariant', id: number, sku: string, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, product: { __typename?: 'Product', id: number, slug: string, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } }> | null };

export type AdminUpdateUserRoleMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  role: Role;
}>;


export type AdminUpdateUserRoleMutation = { __typename?: 'Mutation', updateUserRole: any };

export type AdminUsersPageQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Role>;
  email?: InputMaybe<Scalars['String']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<UserSortingField>;
  cursor?: InputMaybe<Scalars['Int']['input']>;
  ascending?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AdminUsersPageQuery = { __typename?: 'Query', findAllPaginatedUsers: { __typename?: 'PaginatedUser', hasNextPage: boolean, totalCount: number, edges?: Array<{ __typename?: 'UserEdge', cursor: number, node: { __typename?: 'User', id: number, email: string, role: Role, createdAt: any, updatedAt: any } }> | null } };

export type MeFragmentFragment = { __typename?: 'User', id: number, firstName?: string | null, lastName?: string | null, role: Role, email: string } & { ' $fragmentName'?: 'MeFragmentFragment' };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'MeFragmentFragment': MeFragmentFragment } }
  ) };

export type CartFragmentFragment = { __typename?: 'Cart', id: number, items: Array<{ __typename?: 'CartItem', id: number, quantity: number, productVariant: { __typename?: 'ProductVariant', sku: string, priceInCents: number, stock: number, id: number, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, attributes: Array<{ __typename?: 'ProductVariantAttribute', translatedValue?: string | null, value: string, key?: { __typename?: 'ProductVariantAttributeKey', key: string, translatedKey?: string | null } | null }>, product: { __typename?: 'Product', name?: string | null, slug: string, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } }> } & { ' $fragmentName'?: 'CartFragmentFragment' };

export type UpdateCartItemQuantityMutationMutationVariables = Exact<{
  cartItemId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
}>;


export type UpdateCartItemQuantityMutationMutation = { __typename?: 'Mutation', updateCartItemQuantity: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFragmentFragment': CartFragmentFragment } }
  ) };

export type AddItemToCartMutationMutationVariables = Exact<{
  productVariantId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
}>;


export type AddItemToCartMutationMutation = { __typename?: 'Mutation', addItemToCart: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFragmentFragment': CartFragmentFragment } }
  ) };

export type CartQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CartQueryQuery = { __typename?: 'Query', cart: (
    { __typename?: 'Cart' }
    & { ' $fragmentRefs'?: { 'CartFragmentFragment': CartFragmentFragment } }
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
  attributeFilters?: InputMaybe<Array<Array<Scalars['String']['input']> | Scalars['String']['input']> | Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CategoryQueryQuery = { __typename?: 'Query', category: { __typename?: 'Category', id: number, name?: string | null, slug: string, description: string, subcategories: Array<{ __typename?: 'Category', slug: string, name?: string | null, description: string }>, categoryProductVariants: { __typename?: 'PaginatedProductVariant', hasNextPage: boolean, edges?: Array<{ __typename?: 'ProductVariantEdge', cursor: number, node: { __typename?: 'ProductVariant', id: number, sku: string, priceInCents: number, stock: number, product: { __typename?: 'Product', slug: string, name?: string | null, description?: string | null, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null }, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, attributes: Array<{ __typename?: 'ProductVariantAttribute', value: string, translatedValue?: string | null }> } }> | null }, usedProductVariantAttributes: Array<{ __typename?: 'ProductVariantAttribute', id: number, value: string, translatedValue?: string | null, key?: { __typename?: 'ProductVariantAttributeKey', key: string, translatedKey?: string | null } | null }> } };

export type HomepageQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type HomepageQueryQuery = { __typename?: 'Query', searchProductVariants: { __typename?: 'PaginatedProductVariant', edges?: Array<{ __typename?: 'ProductVariantEdge', node: { __typename?: 'ProductVariant', id: number, sku: string, priceInCents: number, attributes: Array<{ __typename?: 'ProductVariantAttribute', value: string, translatedValue?: string | null }>, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, product: { __typename?: 'Product', slug: string, name?: string | null, id: number, description?: string | null, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } }> | null } };

export type NewLlmTaskMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  productId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type NewLlmTaskMutation = { __typename?: 'Mutation', createLlmTask: { __typename?: 'LLMTask', id: number } };

export type LlmUserTaskByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type LlmUserTaskByIdQuery = { __typename?: 'Query', getUserLLMTaskById?: { __typename?: 'LLMTask', id: number, status: LlmTaskStatus, date: any, response?: { __typename?: 'UserPromptResponse', text: string, products?: Array<{ __typename?: 'Product', id: number, slug: string, name?: string | null, thumbnailImage?: { __typename?: 'ProductImage', mimeType: string, base64: string } | null }> | null } | null } | null };

export type CancelOrderMutationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type CancelOrderMutationMutation = { __typename?: 'Mutation', cancelOrder: { __typename?: 'Order', id: number } };

export type RetryPendingOrderMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RetryPendingOrderMutation = { __typename?: 'Mutation', retryPendingPayment: string };

export type OrderDetailsPageQueryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type OrderDetailsPageQueryQuery = { __typename?: 'Query', order?: { __typename?: 'Order', id: number, status: OrderStatus, totalInCents: number, createdAt: any, updatedAt: any, shippingDetails?: { __typename?: 'OrderShippingDetails', line1: string, line2?: string | null, state?: string | null, postalCode: string, country: string, city?: string | null, phone?: string | null } | null, items: Array<{ __typename?: 'OrderItem', sku: string, unitPriceInCents: number, quantity: number, productVariant?: { __typename?: 'ProductVariant', id: number, sku: string, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, product: { __typename?: 'Product', slug: string, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } | null }> } | null };

export type ProductPageQueryQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type ProductPageQueryQuery = { __typename?: 'Query', productBySlug?: { __typename?: 'Product', id: number, name?: string | null, description?: string | null, markdownContent?: string | null, images: Array<{ __typename?: 'ProductImage', id: number, base64: string, mimeType: string, isThumbnail: boolean }>, variants: Array<{ __typename?: 'ProductVariant', id: number, sku: string, stock: number, priceInCents: number, images: Array<{ __typename?: 'ProductVariantImage', id: number, base64: string, mimeType: string, isThumbnail: boolean }>, attributes: Array<{ __typename?: 'ProductVariantAttribute', value: string, translatedValue?: string | null, key?: { __typename?: 'ProductVariantAttributeKey', key: string } | null }> }> } | null };

export type ProductIdBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type ProductIdBySlugQuery = { __typename?: 'Query', productBySlug?: { __typename?: 'Product', id: number } | null };

export type SearchProductsQueryQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
  productsCursor?: InputMaybe<Scalars['Int']['input']>;
  productsPageSize?: InputMaybe<Scalars['Int']['input']>;
  attributeFilters?: InputMaybe<Array<Array<Scalars['String']['input']> | Scalars['String']['input']> | Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type SearchProductsQueryQuery = { __typename?: 'Query', searchProductVariants: { __typename?: 'PaginatedProductVariant', hasNextPage: boolean, totalCount: number, edges?: Array<{ __typename?: 'ProductVariantEdge', cursor: number, node: { __typename?: 'ProductVariant', id: number, stock: number, productId: number, sku: string, priceInCents: number, thumbnailImage?: { __typename?: 'ProductVariantImage', base64: string, mimeType: string } | null, attributes: Array<{ __typename?: 'ProductVariantAttribute', value: string, translatedValue?: string | null }>, product: { __typename?: 'Product', slug: string, name?: string | null, description?: string | null, thumbnailImage?: { __typename?: 'ProductImage', base64: string, mimeType: string } | null } } }> | null }, productVariantAttributes: Array<{ __typename?: 'ProductVariantAttribute', translatedValue?: string | null, value: string, key?: { __typename?: 'ProductVariantAttributeKey', id: number, key: string, translatedKey?: string | null } | null }> };

export type AccountDetailsPageQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountDetailsPageQueryQuery = { __typename?: 'Query', me: { __typename?: 'User', firstName?: string | null, lastName?: string | null, email: string, createdAt: any, updatedAt: any, avatar?: { __typename?: 'UserAvatar', base64: string, mimeType: string } | null, orders: Array<{ __typename?: 'Order', id: number, totalInCents: number, createdAt: any, status: OrderStatus, items: Array<{ __typename?: 'OrderItem', sku: string }> }> } };

export type DeleteUserAccountMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserAccountMutationMutation = { __typename?: 'Mutation', deleteAccount?: any | null };

export type UpdateAccountAvatarMutationMutationVariables = Exact<{
  base64: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
}>;


export type UpdateAccountAvatarMutationMutation = { __typename?: 'Mutation', uploadAvatar: any };

export type UpdateUserMutationMutationVariables = Exact<{
  name: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type UpdateUserMutationMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: number } };

export type DeleteAccountAvatarMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountAvatarMutationMutation = { __typename?: 'Mutation', deleteAvatar: any };

export type UpdateUserPasswordMutationMutationVariables = Exact<{
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  confirmNewPassword: Scalars['String']['input'];
}>;


export type UpdateUserPasswordMutationMutation = { __typename?: 'Mutation', updatePassword: any };

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
export const RevenuePerDayLastNinetyDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment RevenuePerDayLastNinetyDaysFragment on Query {
  revenuePerDayStatistic(timePeriod: LAST_NINETY_DAYS) {
    percentChange
    points {
      x
      y
      label
    }
    timePeriod
  }
}
    `, {"fragmentName":"RevenuePerDayLastNinetyDaysFragment"}) as unknown as TypedDocumentString<RevenuePerDayLastNinetyDaysFragmentFragment, unknown>;
export const RevenuePerDayLastSevenDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment RevenuePerDayLastSevenDaysFragment on Query {
  revenuePerDayStatistic(timePeriod: LAST_SEVEN_DAYS) {
    percentChange
    points {
      x
      y
      label
    }
    timePeriod
  }
}
    `, {"fragmentName":"RevenuePerDayLastSevenDaysFragment"}) as unknown as TypedDocumentString<RevenuePerDayLastSevenDaysFragmentFragment, unknown>;
export const BestSellingCategoriesStatisticLastSevenDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment BestSellingCategoriesStatisticLastSevenDaysFragment on Query {
  bestSellingCategoriesStatistic(limit: 5, timePeriod: LAST_SEVEN_DAYS) {
    category {
      id
      slug
    }
    itemsSold
    totalRevenueInCents
  }
}
    `, {"fragmentName":"BestSellingCategoriesStatisticLastSevenDaysFragment"}) as unknown as TypedDocumentString<BestSellingCategoriesStatisticLastSevenDaysFragmentFragment, unknown>;
export const BestSellingProductVariantsStatisticLastSevenDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment BestSellingProductVariantsStatisticLastSevenDaysFragment on Query {
  bestSellingProductVariantsStatistic(limit: 5, timePeriod: LAST_SEVEN_DAYS) {
    productVariant {
      id
      sku
      product {
        id
        name
        slug
      }
    }
    quantitySold
  }
}
    `, {"fragmentName":"BestSellingProductVariantsStatisticLastSevenDaysFragment"}) as unknown as TypedDocumentString<BestSellingProductVariantsStatisticLastSevenDaysFragmentFragment, unknown>;
export const BestSellingCategoriesStatisticLastThirtyDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment BestSellingCategoriesStatisticLastThirtyDaysFragment on Query {
  bestSellingCategoriesStatistic(limit: 5, timePeriod: LAST_THIRTY_DAYS) {
    category {
      id
      slug
    }
    itemsSold
    totalRevenueInCents
  }
}
    `, {"fragmentName":"BestSellingCategoriesStatisticLastThirtyDaysFragment"}) as unknown as TypedDocumentString<BestSellingCategoriesStatisticLastThirtyDaysFragmentFragment, unknown>;
export const BestSellingProductVariantsStatisticLastThirtyDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment BestSellingProductVariantsStatisticLastThirtyDaysFragment on Query {
  bestSellingProductVariantsStatistic(limit: 5, timePeriod: LAST_THIRTY_DAYS) {
    productVariant {
      id
      sku
      product {
        id
        name
        slug
      }
    }
    quantitySold
  }
}
    `, {"fragmentName":"BestSellingProductVariantsStatisticLastThirtyDaysFragment"}) as unknown as TypedDocumentString<BestSellingProductVariantsStatisticLastThirtyDaysFragmentFragment, unknown>;
export const BestSellingCategoriesStatisticLastNinetyDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment BestSellingCategoriesStatisticLastNinetyDaysFragment on Query {
  bestSellingCategoriesStatistic(limit: 5, timePeriod: LAST_NINETY_DAYS) {
    category {
      id
      slug
    }
    itemsSold
    totalRevenueInCents
  }
}
    `, {"fragmentName":"BestSellingCategoriesStatisticLastNinetyDaysFragment"}) as unknown as TypedDocumentString<BestSellingCategoriesStatisticLastNinetyDaysFragmentFragment, unknown>;
export const BestSellingProductVariantsStatisticLastNinetyDaysFragmentFragmentDoc = new TypedDocumentString(`
    fragment BestSellingProductVariantsStatisticLastNinetyDaysFragment on Query {
  bestSellingProductVariantsStatistic(limit: 5, timePeriod: LAST_NINETY_DAYS) {
    productVariant {
      id
      sku
      product {
        id
        name
        slug
      }
    }
    quantitySold
  }
}
    `, {"fragmentName":"BestSellingProductVariantsStatisticLastNinetyDaysFragment"}) as unknown as TypedDocumentString<BestSellingProductVariantsStatisticLastNinetyDaysFragmentFragment, unknown>;
export const MeFragmentFragmentDoc = new TypedDocumentString(`
    fragment MeFragment on User {
  id
  firstName
  lastName
  role
  email
}
    `, {"fragmentName":"MeFragment"}) as unknown as TypedDocumentString<MeFragmentFragment, unknown>;
export const CartFragmentFragmentDoc = new TypedDocumentString(`
    fragment CartFragment on Cart {
  id
  items {
    id
    productVariant {
      sku
      priceInCents
      stock
      id
      thumbnailImage {
        base64
        mimeType
      }
      attributes {
        key {
          key
          translatedKey
        }
        translatedValue
        value
      }
      product {
        name
        slug
        thumbnailImage {
          base64
          mimeType
        }
      }
    }
    quantity
  }
}
    `, {"fragmentName":"CartFragment"}) as unknown as TypedDocumentString<CartFragmentFragment, unknown>;
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
export const AdminUpdateOrderDocument = new TypedDocumentString(`
    mutation AdminUpdateOrder($id: Int!, $newStatus: OrderStatus!) {
  updateOrder(orderId: $id, input: {status: $newStatus})
}
    `) as unknown as TypedDocumentString<AdminUpdateOrderMutation, AdminUpdateOrderMutationVariables>;
export const AdminOrdersPage_QueryDocumentDocument = new TypedDocumentString(`
    query AdminOrdersPage_QueryDocument($cursor: Int, $pageSize: Int!, $sortBy: String, $ascending: Boolean, $status: OrderStatus, $id: Int, $userId: Int, $minPrice: Int, $maxPrice: Int, $dateFrom: DateTime, $dateTo: DateTime) {
  findAllPaginatedOrders(
    cursor: $cursor
    pageSize: $pageSize
    sortBy: $sortBy
    ascending: $ascending
    status: $status
    id: $id
    userId: $userId
    minPrice: $minPrice
    maxPrice: $maxPrice
    dateFrom: $dateFrom
    dateTo: $dateTo
  ) {
    hasNextPage
    edges {
      node {
        id
        totalInCents
        status
        createdAt
        updatedAt
        userId
      }
      cursor
    }
  }
}
    `) as unknown as TypedDocumentString<AdminOrdersPage_QueryDocumentQuery, AdminOrdersPage_QueryDocumentQueryVariables>;
export const AdminOrderDetailPageDocument = new TypedDocumentString(`
    query AdminOrderDetailPage($id: Int!) {
  findOrderById(id: $id) {
    id
    updatedAt
    createdAt
    status
    totalInCents
    shippingDetails {
      city
      country
      state
      line1
      line2
      postalCode
      phone
    }
    items {
      productVariantId
      sku
      unitPriceInCents
      quantity
      productVariant {
        id
        sku
        sku
        thumbnailImage {
          base64
          mimeType
        }
        product {
          id
          slug
          thumbnailImage {
            base64
            mimeType
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminOrderDetailPageQuery, AdminOrderDetailPageQueryVariables>;
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
export const DeleteAttributeKeyMutationDocument = new TypedDocumentString(`
    mutation DeleteAttributeKeyMutation($id: Int!) {
  removeProductVariantAttributeKey(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteAttributeKeyMutationMutation, DeleteAttributeKeyMutationMutationVariables>;
export const CreateAttributeMutationDocument = new TypedDocumentString(`
    mutation CreateAttributeMutation($attributeKeyId: Int!, $attributeValue: String!) {
  createProductVariantAttribute(
    createProductVariantAttributeInput: {keyId: $attributeKeyId, value: $attributeValue}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateAttributeMutationMutation, CreateAttributeMutationMutationVariables>;
export const UpdateAttributeMutationDocument = new TypedDocumentString(`
    mutation UpdateAttributeMutation($id: Int!, $attributeValue: String!) {
  updateProductVariantAttribute(
    updateProductVariantAttributeInput: {id: $id, value: $attributeValue}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateAttributeMutationMutation, UpdateAttributeMutationMutationVariables>;
export const DeleteAttributeMutationDocument = new TypedDocumentString(`
    mutation DeleteAttributeMutation($id: Int!) {
  removeProductVariantAttribute(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteAttributeMutationMutation, DeleteAttributeMutationMutationVariables>;
export const CreateAttributeKeyTranslationMutationDocument = new TypedDocumentString(`
    mutation CreateAttributeKeyTranslationMutation($attributeKeyId: Int!, $keyTranslation: String!, $locale: String!) {
  createProductVariantAttributeKeyTranslation(
    input: {keyId: $attributeKeyId, keyTranslation: $keyTranslation, localeCode: $locale}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateAttributeKeyTranslationMutationMutation, CreateAttributeKeyTranslationMutationMutationVariables>;
export const DeleteAttributeKeyTranslationMutationDocument = new TypedDocumentString(`
    mutation DeleteAttributeKeyTranslationMutation($id: Int!) {
  removeProductVariantAttributeKeyTranslation(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteAttributeKeyTranslationMutationMutation, DeleteAttributeKeyTranslationMutationMutationVariables>;
export const DeleteAttributeTranslationMutationDocument = new TypedDocumentString(`
    mutation DeleteAttributeTranslationMutation($id: Int!) {
  removeProductVariantAttributeTranslation(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteAttributeTranslationMutationMutation, DeleteAttributeTranslationMutationMutationVariables>;
export const UpdateAttributeKeyTranslationMutationDocument = new TypedDocumentString(`
    mutation UpdateAttributeKeyTranslationMutation($id: Int!, $keyTranslation: String!, $locale: String!) {
  updateProductVariantAttributeKeyTranslation(
    input: {id: $id, keyTranslation: $keyTranslation, localeCode: $locale}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateAttributeKeyTranslationMutationMutation, UpdateAttributeKeyTranslationMutationMutationVariables>;
export const CreateProductVariantAttributeTranslationDocument = new TypedDocumentString(`
    mutation CreateProductVariantAttributeTranslation($attributeId: Int!, $valueTranslation: String!, $locale: String!) {
  createProductVariantAttributeTranslation(
    input: {attributeId: $attributeId, valueTranslation: $valueTranslation, locale: $locale}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateProductVariantAttributeTranslationMutation, CreateProductVariantAttributeTranslationMutationVariables>;
export const UpdateProductVariantAttributeTranslationMutationDocument = new TypedDocumentString(`
    mutation UpdateProductVariantAttributeTranslationMutation($id: Int!, $valueTranslation: String!, $locale: String!) {
  updateProductVariantAttributeTranslation(
    input: {id: $id, valueTranslation: $valueTranslation, locale: $locale}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateProductVariantAttributeTranslationMutationMutation, UpdateProductVariantAttributeTranslationMutationMutationVariables>;
export const DeleteProductVariantAttributeTranslationMutationDocument = new TypedDocumentString(`
    mutation DeleteProductVariantAttributeTranslationMutation($id: Int!) {
  removeProductVariantAttributeTranslation(id: $id)
}
    `) as unknown as TypedDocumentString<DeleteProductVariantAttributeTranslationMutationMutation, DeleteProductVariantAttributeTranslationMutationMutationVariables>;
export const PagedAttributeKeysQueryDocument = new TypedDocumentString(`
    query PagedAttributeKeysQuery($cursor: Int, $pageSize: Int!, $id: Int, $key: String, $ascending: Boolean, $sortBy: AttributeKeySortingField) {
  findAllPaginatedProductVariantAttributeKeys(
    cursor: $cursor
    pageSize: $pageSize
    ascending: $ascending
    sortBy: $sortBy
    id: $id
    key: $key
  ) {
    hasNextPage
    totalCount
    edges {
      cursor
      node {
        id
        key
        createdAt
        updatedAt
        attributes {
          id
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<PagedAttributeKeysQueryQuery, PagedAttributeKeysQueryQueryVariables>;
export const AdminAttributeKeyDetailsPageQueryDocument = new TypedDocumentString(`
    query AdminAttributeKeyDetailsPageQuery($id: Int!) {
  productVariantAttributeKey(id: $id) {
    id
    key
    createdAt
    updatedAt
    attributes {
      id
      value
      productVariants {
        id
        sku
        productId
      }
      translations {
        id
        locale
        value
      }
    }
    translations {
      id
      keyTranslation
      locale
    }
  }
  locales {
    code
    name
    flag
  }
}
    `) as unknown as TypedDocumentString<AdminAttributeKeyDetailsPageQueryQuery, AdminAttributeKeyDetailsPageQueryQueryVariables>;
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
export const GenerateProductEmbeddingMutationDocument = new TypedDocumentString(`
    mutation GenerateProductEmbeddingMutation($productId: Int!, $lang: String!) {
  generateProductEmbedding(productId: $productId, lang: $lang) {
    id
    status
    createdAt
  }
}
    `) as unknown as TypedDocumentString<GenerateProductEmbeddingMutationMutation, GenerateProductEmbeddingMutationMutationVariables>;
export const GenerateProductContentEmbeddingMutationDocument = new TypedDocumentString(`
    mutation GenerateProductContentEmbeddingMutation($productId: Int!, $lang: String!) {
  generateProductContentEmbedding(productId: $productId, lang: $lang) {
    id
    status
    createdAt
  }
}
    `) as unknown as TypedDocumentString<GenerateProductContentEmbeddingMutationMutation, GenerateProductContentEmbeddingMutationMutationVariables>;
export const RegenerateAllProductEmbeddingsMutationDocument = new TypedDocumentString(`
    mutation RegenerateAllProductEmbeddingsMutation {
  regenerateAllProductEmbeddings
}
    `) as unknown as TypedDocumentString<RegenerateAllProductEmbeddingsMutationMutation, RegenerateAllProductEmbeddingsMutationMutationVariables>;
export const RegenerateAllProductContentEmbeddingsMutationDocument = new TypedDocumentString(`
    mutation RegenerateAllProductContentEmbeddingsMutation {
  regenerateAllProductContentEmbeddings
}
    `) as unknown as TypedDocumentString<RegenerateAllProductContentEmbeddingsMutationMutation, RegenerateAllProductContentEmbeddingsMutationMutationVariables>;
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
    embeddings {
      id
      lang
      createdAt
      status
    }
    contentEmbeddings {
      id
      lang
      createdAt
      status
    }
    missingEmbeddingLanguages
    missingContentEmbeddingLanguages
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
export const AdminPageStatisticsDocument = new TypedDocumentString(`
    query AdminPageStatistics {
  BestSellingCategoriesStatisticLastSevenDays: bestSellingCategoriesStatistic(
    limit: 5
    timePeriod: LAST_SEVEN_DAYS
  ) {
    category {
      id
      slug
    }
    itemsSold
    totalRevenueInCents
  }
  BestSellingCategoriesStatisticLastThirtyDaysFragment: bestSellingCategoriesStatistic(
    limit: 5
    timePeriod: LAST_THIRTY_DAYS
  ) {
    category {
      id
      slug
    }
    itemsSold
    totalRevenueInCents
  }
  BestSellingCategoriesStatisticLastNinetyDaysFragment: bestSellingCategoriesStatistic(
    limit: 5
    timePeriod: LAST_NINETY_DAYS
  ) {
    category {
      id
      slug
    }
    itemsSold
    totalRevenueInCents
  }
  RevenuePerDayLastNinetyDaysFragment: revenuePerDayStatistic(
    timePeriod: LAST_NINETY_DAYS
  ) {
    percentChange
    points {
      x
      y
      label
    }
    timePeriod
  }
  RevenuePerDayLastSevenDaysFragment: revenuePerDayStatistic(
    timePeriod: LAST_SEVEN_DAYS
  ) {
    percentChange
    points {
      x
      y
      label
    }
    timePeriod
  }
  RevenuePerDayLastThirtyDaysFragment: revenuePerDayStatistic(
    timePeriod: LAST_THIRTY_DAYS
  ) {
    percentChange
    points {
      x
      y
      label
    }
    timePeriod
  }
  BestSellingProductVariantsStatisticLastSevenDaysFragment: bestSellingProductVariantsStatistic(
    limit: 5
    timePeriod: LAST_SEVEN_DAYS
  ) {
    quantitySold
    productVariant {
      id
      sku
      thumbnailImage {
        base64
        mimeType
      }
      product {
        id
        slug
        thumbnailImage {
          base64
          mimeType
        }
      }
    }
  }
  BestSellingProductVariantsStatisticLastThirtyDaysFragment: bestSellingProductVariantsStatistic(
    limit: 5
    timePeriod: LAST_THIRTY_DAYS
  ) {
    quantitySold
    productVariant {
      id
      sku
      thumbnailImage {
        base64
        mimeType
      }
      product {
        id
        slug
        thumbnailImage {
          base64
          mimeType
        }
      }
    }
  }
  BestSellingProductVariantsStatisticLastNinetyDaysFragment: bestSellingProductVariantsStatistic(
    limit: 5
    timePeriod: LAST_NINETY_DAYS
  ) {
    quantitySold
    productVariant {
      id
      sku
      thumbnailImage {
        base64
        mimeType
      }
      product {
        id
        slug
        thumbnailImage {
          base64
          mimeType
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminPageStatisticsQuery, AdminPageStatisticsQueryVariables>;
export const AdminUpdateUserRoleDocument = new TypedDocumentString(`
    mutation AdminUpdateUserRole($id: Int!, $role: Role!) {
  updateUserRole(userId: $id, newRole: $role)
}
    `) as unknown as TypedDocumentString<AdminUpdateUserRoleMutation, AdminUpdateUserRoleMutationVariables>;
export const AdminUsersPageDocument = new TypedDocumentString(`
    query AdminUsersPage($id: Int, $role: Role, $email: String, $pageSize: Int, $sortBy: UserSortingField, $cursor: Int, $ascending: Boolean) {
  findAllPaginatedUsers(
    id: $id
    role: $role
    email: $email
    pageSize: $pageSize
    sortBy: $sortBy
    cursor: $cursor
    ascending: $ascending
  ) {
    hasNextPage
    totalCount
    edges {
      cursor
      node {
        id
        email
        role
        createdAt
        updatedAt
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminUsersPageQuery, AdminUsersPageQueryVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    ...MeFragment
  }
}
    fragment MeFragment on User {
  id
  firstName
  lastName
  role
  email
}`) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const UpdateCartItemQuantityMutationDocument = new TypedDocumentString(`
    mutation UpdateCartItemQuantityMutation($cartItemId: Int!, $quantity: Int!) {
  updateCartItemQuantity(cartItemId: $cartItemId, quantity: $quantity) {
    ...CartFragment
  }
}
    fragment CartFragment on Cart {
  id
  items {
    id
    productVariant {
      sku
      priceInCents
      stock
      id
      thumbnailImage {
        base64
        mimeType
      }
      attributes {
        key {
          key
          translatedKey
        }
        translatedValue
        value
      }
      product {
        name
        slug
        thumbnailImage {
          base64
          mimeType
        }
      }
    }
    quantity
  }
}`) as unknown as TypedDocumentString<UpdateCartItemQuantityMutationMutation, UpdateCartItemQuantityMutationMutationVariables>;
export const AddItemToCartMutationDocument = new TypedDocumentString(`
    mutation AddItemToCartMutation($productVariantId: Int!, $quantity: Int!) {
  addItemToCart(productVariantId: $productVariantId, quantity: $quantity) {
    ...CartFragment
  }
}
    fragment CartFragment on Cart {
  id
  items {
    id
    productVariant {
      sku
      priceInCents
      stock
      id
      thumbnailImage {
        base64
        mimeType
      }
      attributes {
        key {
          key
          translatedKey
        }
        translatedValue
        value
      }
      product {
        name
        slug
        thumbnailImage {
          base64
          mimeType
        }
      }
    }
    quantity
  }
}`) as unknown as TypedDocumentString<AddItemToCartMutationMutation, AddItemToCartMutationMutationVariables>;
export const CartQueryDocument = new TypedDocumentString(`
    query CartQuery {
  cart {
    ...CartFragment
  }
}
    fragment CartFragment on Cart {
  id
  items {
    id
    productVariant {
      sku
      priceInCents
      stock
      id
      thumbnailImage {
        base64
        mimeType
      }
      attributes {
        key {
          key
          translatedKey
        }
        translatedValue
        value
      }
      product {
        name
        slug
        thumbnailImage {
          base64
          mimeType
        }
      }
    }
    quantity
  }
}`) as unknown as TypedDocumentString<CartQueryQuery, CartQueryQueryVariables>;
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
    query CategoryQuery($slug: String!, $productsCursor: Int, $productsPageSize: Int, $attributeFilters: [[String!]!]) {
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
      attributeFilters: $attributeFilters
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
          id
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
export const HomepageQueryDocument = new TypedDocumentString(`
    query HomepageQuery {
  searchProductVariants(ascending: false, sortBy: "createdAt", pageSize: 6) {
    edges {
      node {
        id
        sku
        priceInCents
        attributes {
          value
          translatedValue
        }
        thumbnailImage {
          base64
          mimeType
        }
        product {
          slug
          name
          id
          description
          thumbnailImage {
            base64
            mimeType
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<HomepageQueryQuery, HomepageQueryQueryVariables>;
export const NewLlmTaskDocument = new TypedDocumentString(`
    mutation newLLMTask($prompt: String!, $productId: Int) {
  createLlmTask(input: {prompt: $prompt, productId: $productId}) {
    id
  }
}
    `) as unknown as TypedDocumentString<NewLlmTaskMutation, NewLlmTaskMutationVariables>;
export const LlmUserTaskByIdDocument = new TypedDocumentString(`
    query LLMUserTaskById($id: Int!) {
  getUserLLMTaskById(id: $id) {
    id
    response {
      text
      products {
        id
        slug
        name
        thumbnailImage {
          mimeType
          base64
        }
      }
    }
    status
    date
  }
}
    `) as unknown as TypedDocumentString<LlmUserTaskByIdQuery, LlmUserTaskByIdQueryVariables>;
export const CancelOrderMutationDocument = new TypedDocumentString(`
    mutation CancelOrderMutation($id: Int!) {
  cancelOrder(id: $id) {
    id
  }
}
    `) as unknown as TypedDocumentString<CancelOrderMutationMutation, CancelOrderMutationMutationVariables>;
export const RetryPendingOrderDocument = new TypedDocumentString(`
    mutation RetryPendingOrder($id: Int!) {
  retryPendingPayment(orderId: $id)
}
    `) as unknown as TypedDocumentString<RetryPendingOrderMutation, RetryPendingOrderMutationVariables>;
export const OrderDetailsPageQueryDocument = new TypedDocumentString(`
    query OrderDetailsPageQuery($id: Int!) {
  order(id: $id) {
    id
    status
    totalInCents
    createdAt
    updatedAt
    shippingDetails {
      line1
      line2
      state
      postalCode
      country
      city
      phone
    }
    items {
      sku
      unitPriceInCents
      quantity
      productVariant {
        id
        sku
        thumbnailImage {
          base64
          mimeType
        }
        product {
          slug
          thumbnailImage {
            base64
            mimeType
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<OrderDetailsPageQueryQuery, OrderDetailsPageQueryQueryVariables>;
export const ProductPageQueryDocument = new TypedDocumentString(`
    query ProductPageQuery($slug: String!) {
  productBySlug(slug: $slug) {
    id
    name
    description
    markdownContent
    images {
      id
      base64
      mimeType
      isThumbnail
    }
    variants {
      id
      sku
      stock
      priceInCents
      images {
        id
        base64
        mimeType
        isThumbnail
      }
      attributes {
        value
        translatedValue
        key {
          key
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ProductPageQueryQuery, ProductPageQueryQueryVariables>;
export const ProductIdBySlugDocument = new TypedDocumentString(`
    query ProductIdBySlug($slug: String!) {
  productBySlug(slug: $slug) {
    id
  }
}
    `) as unknown as TypedDocumentString<ProductIdBySlugQuery, ProductIdBySlugQueryVariables>;
export const SearchProductsQueryDocument = new TypedDocumentString(`
    query SearchProductsQuery($searchTerm: String!, $productsCursor: Int, $productsPageSize: Int, $attributeFilters: [[String!]!]) {
  searchProductVariants(
    attributeFilters: $attributeFilters
    cursor: $productsCursor
    pageSize: $productsPageSize
    searchTerm: $searchTerm
  ) {
    hasNextPage
    totalCount
    edges {
      cursor
      node {
        id
        stock
        productId
        sku
        priceInCents
        thumbnailImage {
          base64
          mimeType
        }
        attributes {
          value
          translatedValue
        }
        product {
          slug
          name
          thumbnailImage {
            base64
            mimeType
          }
          description
        }
      }
    }
  }
  productVariantAttributes {
    key {
      id
      key
      translatedKey
    }
    translatedValue
    value
  }
}
    `) as unknown as TypedDocumentString<SearchProductsQueryQuery, SearchProductsQueryQueryVariables>;
export const AccountDetailsPageQueryDocument = new TypedDocumentString(`
    query AccountDetailsPageQuery {
  me {
    firstName
    lastName
    email
    avatar {
      base64
      mimeType
    }
    createdAt
    updatedAt
    orders {
      id
      totalInCents
      createdAt
      items {
        sku
      }
      status
    }
  }
}
    `) as unknown as TypedDocumentString<AccountDetailsPageQueryQuery, AccountDetailsPageQueryQueryVariables>;
export const DeleteUserAccountMutationDocument = new TypedDocumentString(`
    mutation DeleteUserAccountMutation {
  deleteAccount
}
    `) as unknown as TypedDocumentString<DeleteUserAccountMutationMutation, DeleteUserAccountMutationMutationVariables>;
export const UpdateAccountAvatarMutationDocument = new TypedDocumentString(`
    mutation UpdateAccountAvatarMutation($base64: String!, $mimeType: String!) {
  uploadAvatar(base64: $base64, mimeType: $mimeType)
}
    `) as unknown as TypedDocumentString<UpdateAccountAvatarMutationMutation, UpdateAccountAvatarMutationMutationVariables>;
export const UpdateUserMutationDocument = new TypedDocumentString(`
    mutation UpdateUserMutation($name: String!, $lastName: String!, $email: String!) {
  updateUser(input: {email: $email, name: $name, lastName: $lastName}) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateUserMutationMutation, UpdateUserMutationMutationVariables>;
export const DeleteAccountAvatarMutationDocument = new TypedDocumentString(`
    mutation DeleteAccountAvatarMutation {
  deleteAvatar
}
    `) as unknown as TypedDocumentString<DeleteAccountAvatarMutationMutation, DeleteAccountAvatarMutationMutationVariables>;
export const UpdateUserPasswordMutationDocument = new TypedDocumentString(`
    mutation UpdateUserPasswordMutation($currentPassword: String!, $newPassword: String!, $confirmNewPassword: String!) {
  updatePassword(
    input: {currentPassword: $currentPassword, newPassword: $newPassword, confirmNewPassword: $confirmNewPassword}
  )
}
    `) as unknown as TypedDocumentString<UpdateUserPasswordMutationMutation, UpdateUserPasswordMutationMutationVariables>;