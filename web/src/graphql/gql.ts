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
    "\n    mutation DeleteProductTranslationMutation($id: Int!) {\n      deleteProductTranslation(productTranslationId: $id)\n    }\n  ": typeof types.DeleteProductTranslationMutationDocument,
    "\n  mutation CreateProductTranslationMutation(\n    $productId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n    $markdownContent: String\n  ) {\n    createProductTranslation(\n      productId: $productId\n      createProductTranslationInput: {\n        name: $name\n        description: $description\n        localeCode: $localeCode\n        markdownContent: $markdownContent\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n": typeof types.CreateProductTranslationMutationDocument,
    "\n  mutation EditProductTranslationMutation(\n    $translationId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n    $markdownContent: String\n  ) {\n    editProductTranslation(\n      editProductTranslationInput: {\n        productTranslationId: $translationId\n        name: $name\n        description: $description\n        localeCode: $localeCode\n        markdownContent: $markdownContent\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n": typeof types.EditProductTranslationMutationDocument,
    "\n  mutation CreateAttributeKeyMutation($key: String!) {\n    createProductVariantAttributeKey(\n      createProductVariantAttributeKeyInput: { key: $key }\n    ) {\n      id\n      key\n    }\n  }\n": typeof types.CreateAttributeKeyMutationDocument,
    "\n  mutation EditAttributeKeyMutation($id: Int!, $key: String!) {\n    updateProductVariantAttributeKey(\n      updateProductVariantAttributeKeyInput: { id: $id, key: $key }\n    ) {\n      id\n      key\n    }\n  }\n": typeof types.EditAttributeKeyMutationDocument,
    "\n  mutation CreateAttributeMutation(\n    $attributeKeyId: Int!\n    $attributeValue: String!\n  ) {\n    createProductVariantAttribute(\n      createProductVariantAttributeInput: {\n        keyId: $attributeKeyId\n        value: $attributeValue\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.CreateAttributeMutationDocument,
    "\n  mutation CreateProductMutation(\n    $slug: String!\n    $categoryId: Int\n    $isPublic: Boolean!\n  ) {\n    createProduct(\n      createProductInput: {\n        slug: $slug\n        categoryId: $categoryId\n        isPublic: $isPublic\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.CreateProductMutationDocument,
    "\n  mutation EditProductMutation(\n    $id: Int!\n    $slug: String!\n    $categoryId: Int\n    $isPublic: Boolean!\n  ) {\n    updateProduct(\n      updateProductInput: {\n        id: $id\n        slug: $slug\n        categoryId: $categoryId\n        isPublic: $isPublic\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.EditProductMutationDocument,
    "\n  mutation AddImageMutation(\n    $productId: Int!\n    $mimeType: String!\n    $base64: String!\n  ) {\n    addProductImage(\n      productId: $productId\n      mimeType: $mimeType\n      base64: $base64\n    ) {\n      id\n    }\n  }\n": typeof types.AddImageMutationDocument,
    "\n  mutation AddVariantImageMutation(\n    $productVariantId: Int!\n    $mimeType: String!\n    $base64: String!\n  ) {\n    addProductVariantImage(\n      productVariantId: $productVariantId\n      mimeType: $mimeType\n      base64: $base64\n    ) {\n      id\n    }\n  }\n": typeof types.AddVariantImageMutationDocument,
    "\n  mutation SetImageThumbnailMutation($imageId: Int!) {\n    setProductThumbnailImage(productImageId: $imageId) {\n      id\n    }\n  }\n": typeof types.SetImageThumbnailMutationDocument,
    "\n  mutation SetVariantImageThumbnailMutation($imageId: Int!) {\n    setProductVariantThumbnailImage(id: $imageId) {\n      id\n    }\n  }\n": typeof types.SetVariantImageThumbnailMutationDocument,
    "\n  mutation DeleteProductImageMutation($imageId: Int!) {\n    deleteProductImage(productImageId: $imageId)\n  }\n": typeof types.DeleteProductImageMutationDocument,
    "\n  mutation DeleteVariantImageMutation($imageId: Int!) {\n    removeProductVariantImage(id: $imageId)\n  }\n": typeof types.DeleteVariantImageMutationDocument,
    "\n  mutation CreateVariantMutation(\n    $productId: Int!\n    $sku: String!\n    $priceInCents: Int!\n    $isPublic: Boolean!\n    $stock: Int!\n    $attributes: [Int!]!\n  ) {\n    createProductVariant(\n      createProductVariantInput: {\n        productId: $productId\n        sku: $sku\n        priceInCents: $priceInCents\n        isPublic: $isPublic\n        stock: $stock\n        attributes: $attributes\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.CreateVariantMutationDocument,
    "\n  mutation EditVariantMutation(\n    $id: Int!\n    $sku: String!\n    $priceInCents: Int!\n    $isPublic: Boolean!\n    $stock: Int!\n    $attributes: [Int!]!\n  ) {\n    updateProductVariant(\n      updateProductVariantInput: {\n        id: $id\n        sku: $sku\n        priceInCents: $priceInCents\n        isPublic: $isPublic\n        stock: $stock\n        attributes: $attributes\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.EditVariantMutationDocument,
    "\n  mutation DeleteVariantMutation($id: Int!) {\n    removeProductVariant(id: $id)\n  }\n": typeof types.DeleteVariantMutationDocument,
    "\n  query NewProductPage_QueryDocument {\n    categories(isPublic: null, isSetup: null) {\n      id\n      slug\n    }\n  }\n": typeof types.NewProductPage_QueryDocumentDocument,
    "\n  query ProductDetailPage_QueryDocument($id: Int!) {\n    categories(isPublic: null, isSetup: null) {\n      id\n      slug\n    }\n    locales {\n      flag\n      code\n      name\n    }\n    productVariantAttributeKeys(productId: null) {\n      id\n      key\n      attributes {\n        id\n        value\n        translations {\n          value\n          locale\n        }\n      }\n    }\n    product(id: $id, isPublic: null, isSetup: null) {\n      id\n      slug\n      isPublic\n      isSetup\n      categoryId\n      createdAt\n      updatedAt\n      translations {\n        id\n        locale\n        name\n        description\n        markdownContent\n      }\n      images {\n        id\n        base64\n        mimeType\n        isThumbnail\n      }\n      variants(includeHidden: true) {\n        id\n        sku\n        priceInCents\n        isPublic\n        stock\n        attributes {\n          id\n          value\n          key {\n            id\n            key\n            translations {\n              keyTranslation\n            }\n          }\n          translations {\n            value\n          }\n        }\n        images {\n          id\n          base64\n          mimeType\n          isThumbnail\n        }\n      }\n    }\n  }\n": typeof types.ProductDetailPage_QueryDocumentDocument,
    "\n  query ProductsPage_QueryDocument(\n    $cursor: Int\n    $pageSize: Int!\n    $sortBy: String\n    $ascending: Boolean\n    $slug: String\n    $isSetup: Boolean\n    $isPublic: Boolean\n    $categoryId: Int\n  ) {\n    products(\n      cursor: $cursor\n      pageSize: $pageSize\n      sortBy: $sortBy\n      ascending: $ascending\n      slug: $slug\n      isSetup: $isSetup\n      isPublic: $isPublic\n      categoryId: $categoryId\n    ) {\n      hasNextPage\n      edges {\n        node {\n          id\n          slug\n          isPublic\n          isSetup\n          categoryId\n          createdAt\n          updatedAt\n        }\n        cursor\n      }\n    }\n  }\n": typeof types.ProductsPage_QueryDocumentDocument,
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": typeof types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": typeof types.MeDocument,
    "\n  query HeaderQuery {\n    ...HeaderNav_QueryFragment\n  }\n": typeof types.HeaderQueryDocument,
    "\n  query CategoryQuery(\n    $slug: String!\n    $productsCursor: Int\n    $productsPageSize: Int\n  ) {\n    category(slug: $slug) {\n      id\n      name\n      slug\n      description\n      subcategories {\n        slug\n        name\n        description\n      }\n      categoryProductVariants(\n        cursor: $productsCursor\n        pageSize: $productsPageSize\n        includeSubcategories: true\n      ) {\n        hasNextPage\n        edges {\n          cursor\n          node {\n            product {\n              slug\n              thumbnailImage {\n                base64\n                mimeType\n              }\n              name\n              description\n            }\n            sku\n            thumbnailImage {\n              base64\n              mimeType\n            }\n            priceInCents\n            stock\n            attributes {\n              value\n              translatedValue\n            }\n          }\n        }\n      }\n      usedProductVariantAttributes {\n        id\n        value\n        translatedValue\n        key {\n          key\n          translatedKey\n        }\n      }\n    }\n  }\n": typeof types.CategoryQueryDocument,
    "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentCategoryId: null) {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        slug\n        name\n      }\n    }\n  }\n": typeof types.HeaderNav_QueryFragmentFragmentDoc,
};
const documents: Documents = {
    "\n  fragment CategoryParentSelectDataFragment on Category {\n    id\n    slug\n  }\n": types.CategoryParentSelectDataFragmentFragmentDoc,
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
    "\n    mutation DeleteProductTranslationMutation($id: Int!) {\n      deleteProductTranslation(productTranslationId: $id)\n    }\n  ": types.DeleteProductTranslationMutationDocument,
    "\n  mutation CreateProductTranslationMutation(\n    $productId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n    $markdownContent: String\n  ) {\n    createProductTranslation(\n      productId: $productId\n      createProductTranslationInput: {\n        name: $name\n        description: $description\n        localeCode: $localeCode\n        markdownContent: $markdownContent\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n": types.CreateProductTranslationMutationDocument,
    "\n  mutation EditProductTranslationMutation(\n    $translationId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n    $markdownContent: String\n  ) {\n    editProductTranslation(\n      editProductTranslationInput: {\n        productTranslationId: $translationId\n        name: $name\n        description: $description\n        localeCode: $localeCode\n        markdownContent: $markdownContent\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n": types.EditProductTranslationMutationDocument,
    "\n  mutation CreateAttributeKeyMutation($key: String!) {\n    createProductVariantAttributeKey(\n      createProductVariantAttributeKeyInput: { key: $key }\n    ) {\n      id\n      key\n    }\n  }\n": types.CreateAttributeKeyMutationDocument,
    "\n  mutation EditAttributeKeyMutation($id: Int!, $key: String!) {\n    updateProductVariantAttributeKey(\n      updateProductVariantAttributeKeyInput: { id: $id, key: $key }\n    ) {\n      id\n      key\n    }\n  }\n": types.EditAttributeKeyMutationDocument,
    "\n  mutation CreateAttributeMutation(\n    $attributeKeyId: Int!\n    $attributeValue: String!\n  ) {\n    createProductVariantAttribute(\n      createProductVariantAttributeInput: {\n        keyId: $attributeKeyId\n        value: $attributeValue\n      }\n    ) {\n      id\n    }\n  }\n": types.CreateAttributeMutationDocument,
    "\n  mutation CreateProductMutation(\n    $slug: String!\n    $categoryId: Int\n    $isPublic: Boolean!\n  ) {\n    createProduct(\n      createProductInput: {\n        slug: $slug\n        categoryId: $categoryId\n        isPublic: $isPublic\n      }\n    ) {\n      id\n    }\n  }\n": types.CreateProductMutationDocument,
    "\n  mutation EditProductMutation(\n    $id: Int!\n    $slug: String!\n    $categoryId: Int\n    $isPublic: Boolean!\n  ) {\n    updateProduct(\n      updateProductInput: {\n        id: $id\n        slug: $slug\n        categoryId: $categoryId\n        isPublic: $isPublic\n      }\n    ) {\n      id\n    }\n  }\n": types.EditProductMutationDocument,
    "\n  mutation AddImageMutation(\n    $productId: Int!\n    $mimeType: String!\n    $base64: String!\n  ) {\n    addProductImage(\n      productId: $productId\n      mimeType: $mimeType\n      base64: $base64\n    ) {\n      id\n    }\n  }\n": types.AddImageMutationDocument,
    "\n  mutation AddVariantImageMutation(\n    $productVariantId: Int!\n    $mimeType: String!\n    $base64: String!\n  ) {\n    addProductVariantImage(\n      productVariantId: $productVariantId\n      mimeType: $mimeType\n      base64: $base64\n    ) {\n      id\n    }\n  }\n": types.AddVariantImageMutationDocument,
    "\n  mutation SetImageThumbnailMutation($imageId: Int!) {\n    setProductThumbnailImage(productImageId: $imageId) {\n      id\n    }\n  }\n": types.SetImageThumbnailMutationDocument,
    "\n  mutation SetVariantImageThumbnailMutation($imageId: Int!) {\n    setProductVariantThumbnailImage(id: $imageId) {\n      id\n    }\n  }\n": types.SetVariantImageThumbnailMutationDocument,
    "\n  mutation DeleteProductImageMutation($imageId: Int!) {\n    deleteProductImage(productImageId: $imageId)\n  }\n": types.DeleteProductImageMutationDocument,
    "\n  mutation DeleteVariantImageMutation($imageId: Int!) {\n    removeProductVariantImage(id: $imageId)\n  }\n": types.DeleteVariantImageMutationDocument,
    "\n  mutation CreateVariantMutation(\n    $productId: Int!\n    $sku: String!\n    $priceInCents: Int!\n    $isPublic: Boolean!\n    $stock: Int!\n    $attributes: [Int!]!\n  ) {\n    createProductVariant(\n      createProductVariantInput: {\n        productId: $productId\n        sku: $sku\n        priceInCents: $priceInCents\n        isPublic: $isPublic\n        stock: $stock\n        attributes: $attributes\n      }\n    ) {\n      id\n    }\n  }\n": types.CreateVariantMutationDocument,
    "\n  mutation EditVariantMutation(\n    $id: Int!\n    $sku: String!\n    $priceInCents: Int!\n    $isPublic: Boolean!\n    $stock: Int!\n    $attributes: [Int!]!\n  ) {\n    updateProductVariant(\n      updateProductVariantInput: {\n        id: $id\n        sku: $sku\n        priceInCents: $priceInCents\n        isPublic: $isPublic\n        stock: $stock\n        attributes: $attributes\n      }\n    ) {\n      id\n    }\n  }\n": types.EditVariantMutationDocument,
    "\n  mutation DeleteVariantMutation($id: Int!) {\n    removeProductVariant(id: $id)\n  }\n": types.DeleteVariantMutationDocument,
    "\n  query NewProductPage_QueryDocument {\n    categories(isPublic: null, isSetup: null) {\n      id\n      slug\n    }\n  }\n": types.NewProductPage_QueryDocumentDocument,
    "\n  query ProductDetailPage_QueryDocument($id: Int!) {\n    categories(isPublic: null, isSetup: null) {\n      id\n      slug\n    }\n    locales {\n      flag\n      code\n      name\n    }\n    productVariantAttributeKeys(productId: null) {\n      id\n      key\n      attributes {\n        id\n        value\n        translations {\n          value\n          locale\n        }\n      }\n    }\n    product(id: $id, isPublic: null, isSetup: null) {\n      id\n      slug\n      isPublic\n      isSetup\n      categoryId\n      createdAt\n      updatedAt\n      translations {\n        id\n        locale\n        name\n        description\n        markdownContent\n      }\n      images {\n        id\n        base64\n        mimeType\n        isThumbnail\n      }\n      variants(includeHidden: true) {\n        id\n        sku\n        priceInCents\n        isPublic\n        stock\n        attributes {\n          id\n          value\n          key {\n            id\n            key\n            translations {\n              keyTranslation\n            }\n          }\n          translations {\n            value\n          }\n        }\n        images {\n          id\n          base64\n          mimeType\n          isThumbnail\n        }\n      }\n    }\n  }\n": types.ProductDetailPage_QueryDocumentDocument,
    "\n  query ProductsPage_QueryDocument(\n    $cursor: Int\n    $pageSize: Int!\n    $sortBy: String\n    $ascending: Boolean\n    $slug: String\n    $isSetup: Boolean\n    $isPublic: Boolean\n    $categoryId: Int\n  ) {\n    products(\n      cursor: $cursor\n      pageSize: $pageSize\n      sortBy: $sortBy\n      ascending: $ascending\n      slug: $slug\n      isSetup: $isSetup\n      isPublic: $isPublic\n      categoryId: $categoryId\n    ) {\n      hasNextPage\n      edges {\n        node {\n          id\n          slug\n          isPublic\n          isSetup\n          categoryId\n          createdAt\n          updatedAt\n        }\n        cursor\n      }\n    }\n  }\n": types.ProductsPage_QueryDocumentDocument,
    "\n  fragment MeFragment on MeResponse {\n    id\n    avatar\n    emailVerified\n    firstName\n    lastName\n    role\n    email\n  }\n": types.MeFragmentFragmentDoc,
    "\n  query Me {\n    me {\n      ...MeFragment\n    }\n  }\n": types.MeDocument,
    "\n  query HeaderQuery {\n    ...HeaderNav_QueryFragment\n  }\n": types.HeaderQueryDocument,
    "\n  query CategoryQuery(\n    $slug: String!\n    $productsCursor: Int\n    $productsPageSize: Int\n  ) {\n    category(slug: $slug) {\n      id\n      name\n      slug\n      description\n      subcategories {\n        slug\n        name\n        description\n      }\n      categoryProductVariants(\n        cursor: $productsCursor\n        pageSize: $productsPageSize\n        includeSubcategories: true\n      ) {\n        hasNextPage\n        edges {\n          cursor\n          node {\n            product {\n              slug\n              thumbnailImage {\n                base64\n                mimeType\n              }\n              name\n              description\n            }\n            sku\n            thumbnailImage {\n              base64\n              mimeType\n            }\n            priceInCents\n            stock\n            attributes {\n              value\n              translatedValue\n            }\n          }\n        }\n      }\n      usedProductVariantAttributes {\n        id\n        value\n        translatedValue\n        key {\n          key\n          translatedKey\n        }\n      }\n    }\n  }\n": types.CategoryQueryDocument,
    "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentCategoryId: null) {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        slug\n        name\n      }\n    }\n  }\n": types.HeaderNav_QueryFragmentFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryParentSelectDataFragment on Category {\n    id\n    slug\n  }\n"): typeof import('./graphql').CategoryParentSelectDataFragmentFragmentDoc;
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
export function graphql(source: "\n    mutation DeleteProductTranslationMutation($id: Int!) {\n      deleteProductTranslation(productTranslationId: $id)\n    }\n  "): typeof import('./graphql').DeleteProductTranslationMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProductTranslationMutation(\n    $productId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n    $markdownContent: String\n  ) {\n    createProductTranslation(\n      productId: $productId\n      createProductTranslationInput: {\n        name: $name\n        description: $description\n        localeCode: $localeCode\n        markdownContent: $markdownContent\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n"): typeof import('./graphql').CreateProductTranslationMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditProductTranslationMutation(\n    $translationId: Int!\n    $localeCode: String!\n    $name: String!\n    $description: String\n    $markdownContent: String\n  ) {\n    editProductTranslation(\n      editProductTranslationInput: {\n        productTranslationId: $translationId\n        name: $name\n        description: $description\n        localeCode: $localeCode\n        markdownContent: $markdownContent\n      }\n    ) {\n      name\n      description\n      locale\n    }\n  }\n"): typeof import('./graphql').EditProductTranslationMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAttributeKeyMutation($key: String!) {\n    createProductVariantAttributeKey(\n      createProductVariantAttributeKeyInput: { key: $key }\n    ) {\n      id\n      key\n    }\n  }\n"): typeof import('./graphql').CreateAttributeKeyMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditAttributeKeyMutation($id: Int!, $key: String!) {\n    updateProductVariantAttributeKey(\n      updateProductVariantAttributeKeyInput: { id: $id, key: $key }\n    ) {\n      id\n      key\n    }\n  }\n"): typeof import('./graphql').EditAttributeKeyMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAttributeMutation(\n    $attributeKeyId: Int!\n    $attributeValue: String!\n  ) {\n    createProductVariantAttribute(\n      createProductVariantAttributeInput: {\n        keyId: $attributeKeyId\n        value: $attributeValue\n      }\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateAttributeMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProductMutation(\n    $slug: String!\n    $categoryId: Int\n    $isPublic: Boolean!\n  ) {\n    createProduct(\n      createProductInput: {\n        slug: $slug\n        categoryId: $categoryId\n        isPublic: $isPublic\n      }\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateProductMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditProductMutation(\n    $id: Int!\n    $slug: String!\n    $categoryId: Int\n    $isPublic: Boolean!\n  ) {\n    updateProduct(\n      updateProductInput: {\n        id: $id\n        slug: $slug\n        categoryId: $categoryId\n        isPublic: $isPublic\n      }\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').EditProductMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddImageMutation(\n    $productId: Int!\n    $mimeType: String!\n    $base64: String!\n  ) {\n    addProductImage(\n      productId: $productId\n      mimeType: $mimeType\n      base64: $base64\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddImageMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddVariantImageMutation(\n    $productVariantId: Int!\n    $mimeType: String!\n    $base64: String!\n  ) {\n    addProductVariantImage(\n      productVariantId: $productVariantId\n      mimeType: $mimeType\n      base64: $base64\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').AddVariantImageMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetImageThumbnailMutation($imageId: Int!) {\n    setProductThumbnailImage(productImageId: $imageId) {\n      id\n    }\n  }\n"): typeof import('./graphql').SetImageThumbnailMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetVariantImageThumbnailMutation($imageId: Int!) {\n    setProductVariantThumbnailImage(id: $imageId) {\n      id\n    }\n  }\n"): typeof import('./graphql').SetVariantImageThumbnailMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProductImageMutation($imageId: Int!) {\n    deleteProductImage(productImageId: $imageId)\n  }\n"): typeof import('./graphql').DeleteProductImageMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteVariantImageMutation($imageId: Int!) {\n    removeProductVariantImage(id: $imageId)\n  }\n"): typeof import('./graphql').DeleteVariantImageMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateVariantMutation(\n    $productId: Int!\n    $sku: String!\n    $priceInCents: Int!\n    $isPublic: Boolean!\n    $stock: Int!\n    $attributes: [Int!]!\n  ) {\n    createProductVariant(\n      createProductVariantInput: {\n        productId: $productId\n        sku: $sku\n        priceInCents: $priceInCents\n        isPublic: $isPublic\n        stock: $stock\n        attributes: $attributes\n      }\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateVariantMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditVariantMutation(\n    $id: Int!\n    $sku: String!\n    $priceInCents: Int!\n    $isPublic: Boolean!\n    $stock: Int!\n    $attributes: [Int!]!\n  ) {\n    updateProductVariant(\n      updateProductVariantInput: {\n        id: $id\n        sku: $sku\n        priceInCents: $priceInCents\n        isPublic: $isPublic\n        stock: $stock\n        attributes: $attributes\n      }\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').EditVariantMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteVariantMutation($id: Int!) {\n    removeProductVariant(id: $id)\n  }\n"): typeof import('./graphql').DeleteVariantMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NewProductPage_QueryDocument {\n    categories(isPublic: null, isSetup: null) {\n      id\n      slug\n    }\n  }\n"): typeof import('./graphql').NewProductPage_QueryDocumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductDetailPage_QueryDocument($id: Int!) {\n    categories(isPublic: null, isSetup: null) {\n      id\n      slug\n    }\n    locales {\n      flag\n      code\n      name\n    }\n    productVariantAttributeKeys(productId: null) {\n      id\n      key\n      attributes {\n        id\n        value\n        translations {\n          value\n          locale\n        }\n      }\n    }\n    product(id: $id, isPublic: null, isSetup: null) {\n      id\n      slug\n      isPublic\n      isSetup\n      categoryId\n      createdAt\n      updatedAt\n      translations {\n        id\n        locale\n        name\n        description\n        markdownContent\n      }\n      images {\n        id\n        base64\n        mimeType\n        isThumbnail\n      }\n      variants(includeHidden: true) {\n        id\n        sku\n        priceInCents\n        isPublic\n        stock\n        attributes {\n          id\n          value\n          key {\n            id\n            key\n            translations {\n              keyTranslation\n            }\n          }\n          translations {\n            value\n          }\n        }\n        images {\n          id\n          base64\n          mimeType\n          isThumbnail\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ProductDetailPage_QueryDocumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductsPage_QueryDocument(\n    $cursor: Int\n    $pageSize: Int!\n    $sortBy: String\n    $ascending: Boolean\n    $slug: String\n    $isSetup: Boolean\n    $isPublic: Boolean\n    $categoryId: Int\n  ) {\n    products(\n      cursor: $cursor\n      pageSize: $pageSize\n      sortBy: $sortBy\n      ascending: $ascending\n      slug: $slug\n      isSetup: $isSetup\n      isPublic: $isPublic\n      categoryId: $categoryId\n    ) {\n      hasNextPage\n      edges {\n        node {\n          id\n          slug\n          isPublic\n          isSetup\n          categoryId\n          createdAt\n          updatedAt\n        }\n        cursor\n      }\n    }\n  }\n"): typeof import('./graphql').ProductsPage_QueryDocumentDocument;
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
export function graphql(source: "\n  query CategoryQuery(\n    $slug: String!\n    $productsCursor: Int\n    $productsPageSize: Int\n  ) {\n    category(slug: $slug) {\n      id\n      name\n      slug\n      description\n      subcategories {\n        slug\n        name\n        description\n      }\n      categoryProductVariants(\n        cursor: $productsCursor\n        pageSize: $productsPageSize\n        includeSubcategories: true\n      ) {\n        hasNextPage\n        edges {\n          cursor\n          node {\n            product {\n              slug\n              thumbnailImage {\n                base64\n                mimeType\n              }\n              name\n              description\n            }\n            sku\n            thumbnailImage {\n              base64\n              mimeType\n            }\n            priceInCents\n            stock\n            attributes {\n              value\n              translatedValue\n            }\n          }\n        }\n      }\n      usedProductVariantAttributes {\n        id\n        value\n        translatedValue\n        key {\n          key\n          translatedKey\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').CategoryQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HeaderNav_QueryFragment on Query {\n    categories(parentCategoryId: null) {\n      id\n      name\n      description\n      slug\n      subcategories {\n        id\n        slug\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').HeaderNav_QueryFragmentFragmentDoc;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
