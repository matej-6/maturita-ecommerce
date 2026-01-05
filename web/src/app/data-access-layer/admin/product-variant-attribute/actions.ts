"use server";

import { ActionResponse } from "../../formActionResponse";
import { ExecutionResult } from "graphql";
import {
  AdminAttributeKeyDetailsPageQueryQuery,
  CreateAttributeKeyMutationMutation,
  CreateAttributeKeyTranslationMutationMutation,
  CreateProductVariantAttributeTranslationDocument,
  CreateProductVariantAttributeTranslationMutation,
  DeleteAttributeTranslationMutationDocument,
  EditAttributeKeyMutationMutation,
  PagedAttributeKeysQueryQuery,
  UpdateAttributeKeyTranslationMutationMutation,
  UpdateAttributeMutationMutation,
  UpdateProductVariantAttributeTranslationMutationDocument,
  UpdateProductVariantAttributeTranslationMutationMutation,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import {
  CreateAttributeKeyMutation,
  CreateAttributeKeyTranslationMutation,
  CreateAttributeMutation,
  DeleteAttributeKeyMutation,
  DeleteAttributeKeyTranslationMutation,
  DeleteAttributeMutation,
  EditAttributeKeyMutation,
  UpdateAttributeKeyTranslationMutation,
  UpdateAttributeMutation,
} from "./mutations";
import { handleGraphqlError } from "../handleGraphqlFormError";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import {
  AdminAttributeKeyDetailsPageQueryDocument,
  FilterArgs,
  PagedAttributeKeysQueryDocument,
  PagingArgs,
  SortingArgs,
} from "./queries";

export async function createAttributeKeyAction(
  data: { key: string },
  productId?: number
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<CreateAttributeKeyMutationMutation>["data"]
    >["createProductVariantAttributeKey"]
  >
> {
  const res = await execute(CreateAttributeKeyMutation, {
    key: data.key,
  });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  if (productId) {
    revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  }
  revalidatePath(`/${locale}/admin/attribute-keys`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.createProductVariantAttributeKey,
  };
}

export async function updateAttributeKeyAction(
  keyId: number,
  data: { key: string },
  productId?: number
): Promise<
  ActionResponse<
    NonNullable<
      ExecutionResult<EditAttributeKeyMutationMutation>["data"]
    >["updateProductVariantAttributeKey"]
  >
> {
  const res = await execute(EditAttributeKeyMutation, {
    id: keyId,
    key: data.key,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  if (productId) {
    revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  }
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  if (!res.data) {
    return {
      success: false,
      message: "An unknown error ocurred",
    };
  }

  return {
    success: true,
    data: res.data.updateProductVariantAttributeKey,
  };
}

export async function createAttributeAction(
  data: { attributeKeyId: number; attributeValue: string },
  productId?: number
): Promise<ActionResponse<null>> {
  const res = await execute(CreateAttributeMutation, {
    attributeKeyId: data.attributeKeyId,
    attributeValue: data.attributeValue,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/products`);
  if (productId) {
    revalidatePath(`/${locale}/admin/products/product-detail/${productId}`);
  }
  revalidatePath(
    `/${locale}/admin/attribute-keys/key-detail/${data.attributeKeyId}`
  );

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

export async function getPagedAttributeKeysQuery(
  args: FilterArgs & PagingArgs & SortingArgs
): Promise<
  ActionResponse<ExecutionResult<PagedAttributeKeysQueryQuery>["data"]>
> {
  const res = await execute(PagedAttributeKeysQueryDocument, {
    ...args,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function getAttributeKeyDetailsPageQueryAction(
  id: number
): Promise<
  ActionResponse<
    ExecutionResult<AdminAttributeKeyDetailsPageQueryQuery>["data"]
  >
> {
  const res = await execute(AdminAttributeKeyDetailsPageQueryDocument, { id });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  return {
    success: true,
    data: res.data,
  };
}

export async function createAttributeKeyTranslationAction(input: {
  attributeKeyId: number;
  keyTranslation: string;
  locale: string;
}): Promise<
  ActionResponse<
    ExecutionResult<CreateAttributeKeyTranslationMutationMutation>["data"]
  >
> {
  const res = await execute(CreateAttributeKeyTranslationMutation, {
    ...input,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(
    `/${locale}/admin/attribute-keys/key-detail/${input.attributeKeyId}`
  );

  return {
    success: true,
    data: res.data,
  };
}

export async function deleteAttributeKeyTranslationAction(
  id: number,
  keyId: number
): Promise<ActionResponse<null>> {
  const res = await execute(DeleteAttributeKeyTranslationMutation, { id });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  return {
    success: true,
    data: null,
  };
}

export async function updateAttributeKeyTranslationAction(
  input: {
    id: number;
    keyTranslation: string;
    locale: string;
  },
  keyId: number
): Promise<
  ActionResponse<
    ExecutionResult<UpdateAttributeKeyTranslationMutationMutation>["data"]
  >
> {
  const res = await execute(UpdateAttributeKeyTranslationMutation, {
    ...input,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  return {
    success: true,
    data: res.data,
  };
}

export async function deleteAttributeAction(
  id: number,
  keyId: number
): Promise<ActionResponse<null>> {
  const res = await execute(DeleteAttributeMutation, { id });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  return {
    success: true,
    data: null,
  };
}

export async function updateAttributeAction(
  id: number,
  attributeValue: string,
  keyId: number
): Promise<
  ActionResponse<ExecutionResult<UpdateAttributeMutationMutation>["data"]>
> {
  const res = await execute(UpdateAttributeMutation, { id, attributeValue });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  return {
    success: true,
    data: res.data,
  };
}

export async function createAttributeTranslationAction(
  input: {
    id: number;
    valueTranslation: string;
    locale: string;
  },
  keyId: number
): Promise<
  ActionResponse<
    ExecutionResult<CreateProductVariantAttributeTranslationMutation>["data"]
  >
> {
  const res = await execute(CreateProductVariantAttributeTranslationDocument, {
    attributeId: input.id,
    valueTranslation: input.valueTranslation,
    locale: input.locale,
  });

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  return {
    success: true,
    data: res.data,
  };
}

export async function updateAttributeTranslationAction(
  input: {
    id: number;
    valueTranslation: string;
    locale: string;
  },
  keyId: number
): Promise<
  ActionResponse<
    ExecutionResult<UpdateProductVariantAttributeTranslationMutationMutation>["data"]
  >
> {
  const res = await execute(
    UpdateProductVariantAttributeTranslationMutationDocument,
    {
      ...input,
    }
  );

  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  return {
    success: true,
    data: res.data,
  };
}

export async function deleteAttributeTranslationAction(
  id: number,
  keyId: number
): Promise<ActionResponse<null>> {
  const res = await execute(DeleteAttributeTranslationMutationDocument, {
    id,
  });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${keyId}`);

  return {
    success: true,
    data: null,
  };
}

export async function deleteAttributeKeyAction(
  id: number
): Promise<ActionResponse<null>> {
  const res = await execute(DeleteAttributeKeyMutation, { id });
  if (res.errors) {
    return await handleGraphqlError(res.errors);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/admin/attribute-keys`);
  revalidatePath(`/${locale}/admin/attribute-keys/key-detail/${id}`);

  return {
    success: true,
    data: null,
  };
}
