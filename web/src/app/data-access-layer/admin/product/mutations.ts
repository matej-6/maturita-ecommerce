import { graphql } from "@/graphql";
import "server-only";

export const CreateProductMutation = graphql(`
  mutation CreateProductMutation(
    $slug: String!
    $categoryId: Int
    $isPublic: Boolean!
  ) {
    createProduct(
      createProductInput: {
        slug: $slug
        categoryId: $categoryId
        isPublic: $isPublic
      }
    ) {
      id
    }
  }
`);

export const EditProductMutation = graphql(`
  mutation EditProductMutation(
    $id: Int!
    $slug: String!
    $categoryId: Int
    $isPublic: Boolean!
  ) {
    updateProduct(
      updateProductInput: {
        id: $id
        slug: $slug
        categoryId: $categoryId
        isPublic: $isPublic
      }
    ) {
      id
    }
  }
`);

export const AddImageMutation = graphql(`
  mutation AddImageMutation(
    $productId: Int!
    $mimeType: String!
    $base64: String!
  ) {
    addProductImage(
      productId: $productId
      mimeType: $mimeType
      base64: $base64
    ) {
      id
    }
  }
`);

export const AddVariantImageMutation = graphql(`
  mutation AddVariantImageMutation(
    $productVariantId: Int!
    $mimeType: String!
    $base64: String!
  ) {
    addProductVariantImage(
      productVariantId: $productVariantId
      mimeType: $mimeType
      base64: $base64
    ) {
      id
    }
  }
`);

export const SetImageThumbnailMutation = graphql(`
  mutation SetImageThumbnailMutation($imageId: Int!) {
    setProductThumbnailImage(productImageId: $imageId) {
      id
    }
  }
`);

export const SetVariantImageThumbnailMutation = graphql(`
  mutation SetVariantImageThumbnailMutation($imageId: Int!) {
    setProductVariantThumbnailImage(id: $imageId) {
      id
    }
  }
`);

export const DeleteProductImageMutation = graphql(`
  mutation DeleteProductImageMutation($imageId: Int!) {
    deleteProductImage(productImageId: $imageId)
  }
`);

export const DeleteVariantImageMutation = graphql(`
  mutation DeleteVariantImageMutation($imageId: Int!) {
    removeProductVariantImage(id: $imageId)
  }
`);

export const CreateVariantMutation = graphql(`
  mutation CreateVariantMutation(
    $productId: Int!
    $sku: String!
    $priceInCents: Int!
    $isPublic: Boolean!
    $stock: Int!
    $attributes: [Int!]!
  ) {
    createProductVariant(
      createProductVariantInput: {
        productId: $productId
        sku: $sku
        priceInCents: $priceInCents
        isPublic: $isPublic
        stock: $stock
        attributes: $attributes
      }
    ) {
      id
    }
  }
`);

export const EditVariantMutation = graphql(`
  mutation EditVariantMutation(
    $id: Int!
    $sku: String!
    $priceInCents: Int!
    $isPublic: Boolean!
    $stock: Int!
    $attributes: [Int!]!
  ) {
    updateProductVariant(
      updateProductVariantInput: {
        id: $id
        sku: $sku
        priceInCents: $priceInCents
        isPublic: $isPublic
        stock: $stock
        attributes: $attributes
      }
    ) {
      id
    }
  }
`);

export const DeleteVariantMutation = graphql(`
  mutation DeleteVariantMutation($id: Int!) {
    removeProductVariant(id: $id)
  }
`);
