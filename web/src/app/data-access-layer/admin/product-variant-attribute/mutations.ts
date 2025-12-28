import { graphql } from "@/graphql";
import "server-only";

export const CreateAttributeKeyMutation = graphql(`
  mutation CreateAttributeKeyMutation($key: String!) {
    createProductVariantAttributeKey(
      createProductVariantAttributeKeyInput: { key: $key }
    ) {
      id
      key
    }
  }
`);

export const EditAttributeKeyMutation = graphql(`
  mutation EditAttributeKeyMutation($id: Int!, $key: String!) {
    updateProductVariantAttributeKey(
      updateProductVariantAttributeKeyInput: { id: $id, key: $key }
    ) {
      id
      key
    }
  }
`);

export const DeleteAttributeKeyMutation = graphql(`
  mutation DeleteAttributeKeyMutation($id: Int!) {
    removeProductVariantAttributeKey(id: $id)
  }
`);

export const CreateAttributeMutation = graphql(`
  mutation CreateAttributeMutation(
    $attributeKeyId: Int!
    $attributeValue: String!
  ) {
    createProductVariantAttribute(
      createProductVariantAttributeInput: {
        keyId: $attributeKeyId
        value: $attributeValue
      }
    ) {
      id
    }
  }
`);

export const UpdateAttributeMutation = graphql(`
  mutation UpdateAttributeMutation($id: Int!, $attributeValue: String!) {
    updateProductVariantAttribute(
      updateProductVariantAttributeInput: { id: $id, value: $attributeValue }
    ) {
      id
    }
  }
`);

export const DeleteAttributeMutation = graphql(`
  mutation DeleteAttributeMutation($id: Int!) {
    removeProductVariantAttribute(id: $id)
  }
`);

export const CreateAttributeKeyTranslationMutation = graphql(`
  mutation CreateAttributeKeyTranslationMutation(
    $attributeKeyId: Int!
    $keyTranslation: String!
    $locale: String!
  ) {
    createProductVariantAttributeKeyTranslation(
      input: {
        keyId: $attributeKeyId
        keyTranslation: $keyTranslation
        localeCode: $locale
      }
    ) {
      id
    }
  }
`);

export const DeleteAttributeKeyTranslationMutation = graphql(`
  mutation DeleteAttributeKeyTranslationMutation($id: Int!) {
    removeProductVariantAttributeKeyTranslation(id: $id)
  }
`);

export const DeleteAttributeTranslationMutation = graphql(`
  mutation DeleteAttributeTranslationMutation($id: Int!) {
    removeProductVariantAttributeTranslation(id: $id)
  }
`);

export const UpdateAttributeKeyTranslationMutation = graphql(`
  mutation UpdateAttributeKeyTranslationMutation(
    $id: Int!
    $keyTranslation: String!
    $locale: String!
  ) {
    updateProductVariantAttributeKeyTranslation(
      input: { id: $id, keyTranslation: $keyTranslation, localeCode: $locale }
    ) {
      id
    }
  }
`);

export const CreateProductVariantAttributeTranslationMutation = graphql(`
  mutation CreateProductVariantAttributeTranslation(
    $attributeId: Int!
    $valueTranslation: String!
    $locale: String!
  ) {
    createProductVariantAttributeTranslation(
      input: {
        attributeId: $attributeId
        valueTranslation: $valueTranslation
        locale: $locale
      }
    ) {
      id
    }
  }
`);

export const UpdateProductVariantAttributeTranslationMutation = graphql(`
  mutation UpdateProductVariantAttributeTranslationMutation(
    $id: Int!
    $valueTranslation: String!
    $locale: String!
  ) {
    updateProductVariantAttributeTranslation(
      input: { id: $id, valueTranslation: $valueTranslation, locale: $locale }
    ) {
      id
    }
  }
`);

export const DeleteProductVariantAttributeTranslationMutation = graphql(`
  mutation DeleteProductVariantAttributeTranslationMutation($id: Int!) {
    removeProductVariantAttributeTranslation(id: $id)
  }
`);
