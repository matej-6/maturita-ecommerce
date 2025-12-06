import { graphql } from "@/graphql";
import "server-only";

export const DeleteProductTranslationMutation = graphql(
  `
    mutation DeleteProductTranslationMutation($id: Int!) {
      deleteProductTranslation(productTranslationId: $id)
    }
  `
);

export const CreateProductTranslationMutation = graphql(`
  mutation CreateProductTranslationMutation(
    $productId: Int!
    $localeCode: String!
    $name: String!
    $description: String
    $markdownContent: String
  ) {
    createProductTranslation(
      productId: $productId
      createProductTranslationInput: {
        name: $name
        description: $description
        localeCode: $localeCode
        markdownContent: $markdownContent
      }
    ) {
      name
      description
      locale
    }
  }
`);

export const EditProductTranslationMutation = graphql(`
  mutation EditProductTranslationMutation(
    $translationId: Int!
    $localeCode: String!
    $name: String!
    $description: String
    $markdownContent: String
  ) {
    editProductTranslation(
      editProductTranslationInput: {
        productTranslationId: $translationId
        name: $name
        description: $description
        localeCode: $localeCode
        markdownContent: $markdownContent
      }
    ) {
      name
      description
      locale
    }
  }
`);
