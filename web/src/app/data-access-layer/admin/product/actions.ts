"use server";

import { ActionResponse } from "../../formActionResponse";
import { execute } from "@/graphql/execute";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { NewProductPageQueryDocument } from "./queries";
import { ExecutionResult } from "graphql";
import {
  CreateProductMutationMutation,
  CreateVariantMutationMutation,
  EditProductMutationMutation,
  EditVariantMutationMutation,
  GenerateProductContentEmbeddingMutationMutation,
  GenerateProductEmbeddingMutationMutation,
  NewProductPage_QueryDocumentQuery,
} from "@/graphql/graphql";
import {
  CreateProductMutation,
  CreateVariantMutation,
  DeleteProductImageMutation,
  DeleteProductMutation,
  DeleteVariantImageMutation,
  EditProductMutation,
  EditVariantMutation,
  GenerateProductContentEmbeddingMutation,
  GenerateProductEmbeddingMutation,
  RegenerateAllProductContentEmbeddingsMutation,
  RegenerateAllProductEmbeddingsMutation,
  SetImageThumbnailMutation,
  SetVariantImageThumbnailMutation,
} from "./mutations";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { fetchInternal } from "../../fetch-internal";
import { getAuthToken } from "../../auth/actions";

export async function createProductAction(data: {
  categoryId: number | null;
  slug: string;
  isPublic: boolean;
}): Promise<
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

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);

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

export async function editProductAction(data: {
  categoryId: number | null;
  slug: string;
  isPublic: boolean;
  id: number;
}): Promise<
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

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products/product-detail/${data.id}`);
  revalidatePath(`/${locale}/admin/products`);

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

export async function deleteProductAction(
  productId: number,
): Promise<ActionResponse<null>> {
  const res = await execute(DeleteProductMutation, {
    id: productId,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);

  return {
    success: true,
    data: null,
  };
}

export async function uploadProductImageAction(
  productId: number,
  formData: FormData,
): Promise<ActionResponse<null>> {
  const locale = await getLocale();
  const authToken = await getAuthToken();

  const headers: HeadersInit = {
    "x-custom-lang": locale,
  };
  if (authToken) {
    headers["Authorization"] = "Bearer " + authToken;
  }

  const res = await fetchInternal(
    process.env.BACKEND_URL + `/products/upload-image/${productId}`,
    {
      method: "POST",
      body: formData,
      headers,
    },
  );

  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.ok) {
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

export async function uploadVariantImageAction(
  productId: number,
  productVariantId: number,
  formData: FormData,
): Promise<ActionResponse<null>> {
  const locale = await getLocale();
  const authToken = await getAuthToken();

  const headers: HeadersInit = {
    "x-custom-lang": locale,
  };
  if (authToken) {
    headers["Authorization"] = "Bearer " + authToken;
  }

  const res = await fetchInternal(
    process.env.BACKEND_URL +
      `/product-variants/upload-image/${productVariantId}`,
    {
      method: "POST",
      body: formData,
      headers,
    },
  );

  revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  revalidatePath(`/${locale}/admin/products`);

  if (!res.ok) {
    console.error("Failed to upload image:", res.statusText);
    return {
      success: false,
      message: "Failed to upload image",
    };
  }

  return {
    success: true,
    data: null,
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
  imageId: number,
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
  imageId: number,
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
  imageId: number,
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
  imageId: number,
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

export async function createVariantAction(
  productId: number,
  data: {
    sku: string;
    priceInCents: number;
    isPublic: boolean;
    stock: number;
    attributes?: number[];
  },
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<CreateVariantMutationMutation>["data"]
    >["createProductVariant"]
  >
> {
  const res = await execute(CreateVariantMutation, {
    productId: productId,
    sku: data.sku,
    priceInCents: data.priceInCents,
    isPublic: data.isPublic,
    stock: data.stock,
    attributes: data.attributes || [],
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
    data: res.data.createProductVariant,
  };
}

export async function editVariantAction(
  productId: number,
  variantId: number,
  data: {
    sku: string;
    priceInCents: number;
    isPublic: boolean;
    stock: number;
    attributes?: number[];
  },
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<EditVariantMutationMutation>["data"]
    >["updateProductVariant"]
  >
> {
  const res = await execute(EditVariantMutation, {
    id: variantId,
    sku: data.sku,
    priceInCents: data.priceInCents,
    isPublic: data.isPublic,
    stock: data.stock,
    attributes: data.attributes || [],
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
    data: res.data.updateProductVariant,
  };
}

export async function generateProductEmbeddingAction(
  productId: number,
  lang: string,
): Promise<
  ActionResponse<
    ExecutionResult<GenerateProductEmbeddingMutationMutation>["data"]
  >
> {
  const res = await execute(GenerateProductEmbeddingMutation, {
    productId: productId,
    lang: lang,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function generateProdutContentEmbeddingAction(
  productId: number,
  lang: string,
): Promise<
  ActionResponse<
    ExecutionResult<GenerateProductContentEmbeddingMutationMutation>["data"]
  >
> {
  const res = await execute(GenerateProductContentEmbeddingMutation, {
    productId: productId,
    lang: lang,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function regenerateAllProductEmbeddingsAction(): Promise<
  ActionResponse<null>
> {
  const res = await execute(RegenerateAllProductEmbeddingsMutation);
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: null,
  };
}

export async function regenerateProductContentEmeddingsAction(): Promise<
  ActionResponse<null>
> {
  const res = await execute(RegenerateAllProductContentEmbeddingsMutation);
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: null,
  };
}
