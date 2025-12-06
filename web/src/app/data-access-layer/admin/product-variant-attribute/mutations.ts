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
