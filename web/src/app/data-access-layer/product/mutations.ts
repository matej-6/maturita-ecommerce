import "server-only";
import { graphql } from "@/graphql";

export const CreateProductReviewDocument = graphql(`
  mutation CreateProductReview(
    $orderItemId: Int!
    $rating: Int!
    $comment: String
    $lang: String!
  ) {
    createProductReview(
      input: {
        orderItemId: $orderItemId
        rating: $rating
        comment: $comment
        lang: $lang
      }
    ) {
      id
    }
  }
`);

export const UpdateProductReviewDocument = graphql(`
  mutation UpdateProductReview(
    $reviewId: Int!
    $rating: Int!
    $comment: String
    $lang: String!
  ) {
    updateProductReview(
      input: { id: $reviewId, rating: $rating, comment: $comment, lang: $lang }
    ) {
      id
    }
  }
`);

export const DeleteProductReviewDocument = graphql(`
  mutation DeleteProductReview($reviewId: Int!) {
    deleteProductReview(reviewId: $reviewId)
  }
`);
