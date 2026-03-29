"use server";

import { graphql } from "@/graphql";
import { ActionResponse } from "../formActionResponse";
import { ExecutionResult } from "graphql";
import {
  CreateProductReviewMutation,
  DeleteProductReviewMutation,
  UpdateProductReviewMutation,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

const CreateProductReviewDocument = graphql(`
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

const UpdateProductReviewDocument = graphql(`
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

const DeleteProductReviewDocument = graphql(`
  mutation DeleteProductReview($reviewId: Int!) {
    deleteProductReview(reviewId: $reviewId)
  }
`);

export async function createProductReview(input: {
  orderItemId: number;
  orderId: number;
  rating: number;
  comment: string | null;
  lang: string;
}): Promise<
  ActionResponse<ExecutionResult<CreateProductReviewMutation>["data"]>
> {
  const res = await execute(CreateProductReviewDocument, {
    orderItemId: input.orderItemId,
    rating: input.rating,
    comment: input.comment,
    lang: input.lang,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/account/orders/${input.orderId}`);

  return {
    success: true,
    data: res.data,
  };
}

export async function updateProductReview(input: {
  reviewId: number;
  orderId: number;
  rating: number;
  comment: string | null;
  lang: string;
}): Promise<
  ActionResponse<ExecutionResult<UpdateProductReviewMutation>["data"]>
> {
  const res = await execute(UpdateProductReviewDocument, {
    reviewId: input.reviewId,
    rating: input.rating,
    comment: input.comment,
    lang: input.lang,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/account/orders/${input.orderId}`);

  return {
    success: true,
    data: res.data,
  };
}

export async function deleteProductReview(
  reviewId: number,
  orderId: number
): Promise<
  ActionResponse<ExecutionResult<DeleteProductReviewMutation>["data"]>
> {
  const res = await execute(DeleteProductReviewDocument, {
    reviewId: reviewId,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/account/orders/${orderId}`);

  return {
    success: true,
    data: res.data,
  };
}
