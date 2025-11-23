"use server";

import { productFormSchemaType } from "@/app/[locale]/(admin)/admin/schemas/product-form-schema";
import { ActionResponse } from "../../formActionResponse";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { NewProductPageQueryDocument } from "./queries";
import { ExecutionResult } from "graphql";
import {
  AddImageMutationMutation,
  AddVariantImageMutationMutation,
  CreateProductMutationMutation,
  EditProductMutationMutation,
  NewProductPage_QueryDocumentQuery,
} from "@/graphql/graphql";
import {
  AddImageMutation,
  AddVariantImageMutation,
  CreateProductMutation,
  DeleteProductImageMutation,
  DeleteVariantImageMutation,
  EditProductMutation,
  SetImageThumbnailMutation,
  SetVariantImageThumbnailMutation,
} from "./mutations";
import { revalidatePath } from "next/cache";
import { readFileSync } from "fs";
import { getLocale } from "next-intl/server";

export async function createProductAction(
  data: productFormSchemaType
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<CreateProductMutationMutation>["data"]
    >["createProduct"]
  >
> {
  const res = await execute(CreateProductMutation, {
    categoryId: data.categoryId || undefined,
    slug: data.slug,
    isPublic: data.isPublic,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.createProduct,
  };
}

export async function editProductAction(
  data: productFormSchemaType & { id: number },
  revalidatePaths: string[] = []
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<EditProductMutationMutation>["data"]
    >["updateProduct"]
  >
> {
  const res = await execute(EditProductMutation, {
    id: data.id,
    categoryId: data.categoryId || undefined,
    slug: data.slug,
    isPublic: data.isPublic,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  for (const path of revalidatePaths) {
    revalidatePath(path);
  }

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.updateProduct,
  };
}

export async function uploadProductImageAction(
  productId: number,
  base64Image: string,
  mimeType: string
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<AddImageMutationMutation>["data"]
    >["addProductImage"]
  >
> {
  const res = await execute(AddImageMutation, {
    productId: productId,
    mimeType: mimeType,
    base64: base64Image,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.addProductImage,
  };
}

export async function uploadVariantImageAction(
  productId: number,
  productVariantId: number,
  base64Image: string,
  mimeType: string
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<AddVariantImageMutationMutation>["data"]
    >["addProductVariantImage"]
  >
> {
  const res = await execute(AddVariantImageMutation, {
    productVariantId: productVariantId,
    mimeType: mimeType,
    base64: base64Image,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.addProductVariantImage,
  };
}

export async function getDataForNewProductPage(): Promise<
  ActionResponse<
    NonNullable<ExecutionResult<NewProductPage_QueryDocumentQuery>["data"]>
  >
> {
  const res = await execute(NewProductPageQueryDocument);
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function setProductThumbnailImageAction(
  productId: number,
  imageId: number
): Promise<ActionResponse<null>> {
  const res = await execute(SetImageThumbnailMutation, {
    imageId: imageId,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: null,
  };
}

export async function setVariantThumbnailImageAction(
  productId: number,
  productVariantId: number,
  imageId: number
): Promise<ActionResponse<null>> {
  const res = await execute(SetVariantImageThumbnailMutation, {
    imageId: imageId,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: null,
  };
}

export async function deleteProductImageAction(
  productId: number,
  imageId: number
): Promise<ActionResponse<null>> {
  const res = await execute(DeleteProductImageMutation, {
    imageId: imageId,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: null,
  };
}

export async function deleteVariantImageAction(
  productId: number,
  productVariantId: number,
  imageId: number
): Promise<ActionResponse<null>> {
  const res = await execute(DeleteVariantImageMutation, {
    imageId: imageId,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: null,
  };
}
