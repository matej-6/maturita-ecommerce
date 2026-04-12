"use server";
import { execute } from "@/graphql/execute";
import {
  CreateProductReviewMutation,
  DeleteProductReviewMutation,
  PagedProductReviewsByIdQuery,
  ProductIdBySlugQuery,
  ProductPageQueryQuery,
  SearchProductsQueryQuery,
  UpdateProductReviewMutation,
} from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { handleGraphqlError } from "../admin/handleGraphqlFormError";
import { ActionResponse } from "../formActionResponse";
import {
  PagedProductReviewsByIdDocument,
  ProductIdBySlugDocument,
  ProductPageDocument,
} from "./queries";
import {
  CreateProductReviewDocument,
  DeleteProductReviewDocument,
  UpdateProductReviewDocument,
} from "./mutations";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { SearchQueryDocument } from "./queries";

export async function getProductIdBySlugAction(
  slug: string,
): Promise<ActionResponse<ExecutionResult<ProductIdBySlugQuery>["data"]>> {
  const res = await execute(ProductIdBySlugDocument, { slug: slug });
  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
export async function getPagedProductReviewsById(
  productId: number,
  cursor: number | null,
  pageSize: number,
): Promise<
  ActionResponse<ExecutionResult<PagedProductReviewsByIdQuery>["data"]>
> {
  const res = await execute(PagedProductReviewsByIdDocument, {
    productId: productId,
    cursor: cursor,
    pageSize: pageSize,
  });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}
export async function getProductPageData(
  slug: string,
): Promise<ActionResponse<ExecutionResult<ProductPageQueryQuery>["data"]>> {
  const res = await execute(ProductPageDocument, { slug: slug });

  if (res.errors) {
    return handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function deleteProductReview(
  reviewId: number,
  orderId: number,
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
export async function getSearchProductsQueryData(
  searchTerm: string,
  productsCursor: number | null,
  productsPageSize: number | null,
  attributes?: string[][],
): Promise<ActionResponse<ExecutionResult<SearchProductsQueryQuery>["data"]>> {
  const res = await execute(SearchQueryDocument, {
    searchTerm,
    productsCursor,
    productsPageSize,
    attributeFilters: attributes,
  });

  if (res.errors) {
    return {
      success: false,
      message: res.errors.map((e) => e.message).join(", "),
    };
  }

  return {
    success: true,
    data: res.data,
  };
}
