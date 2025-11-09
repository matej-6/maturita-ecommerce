import { graphql } from "@/graphql";
import "server-only";

export const DeleteCategoryTranslationMutation = graphql(
  `
    mutation DeleteCategoryTranslationMutation($id: ID!) {
      deleteCategoryTranslation(categoryTranslationId: $id)
    }
  `
);

export const NewCategoryTranslationMutation = graphql(`
  mutation NewCategoryTranslationMutation(
    $categoryId: ID!
    $localeCode: String!
    $name: String!
    $description: String
  ) {
    createCategoryTranslation(
      newTranslationinput: {
        categoryId: $categoryId
        localeCode: $localeCode
        name: $name
        description: $description
      }
    ) {
      name
      locale
      description
    }
  }
`);

export const EditCategoryTranslationMutation = graphql(`
  mutation EditCategoryTranslationMutation(
    $translationId: ID!
    $localeCode: String!
    $name: String!
    $description: String
  ) {
    updateCategoryTranslation(
      editTranslationInput: {
        categoryTranslationId: $translationId
        name: $name
        description: $description
        localeCode: $localeCode
      }
    ) {
      name
      description
      locale
    }
  }
`);
