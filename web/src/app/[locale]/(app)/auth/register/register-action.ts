"use server";

import { cookies } from "next/headers";
import { parse as parseCookie } from "cookie";
import z from "zod";
import { registerSchema } from "./register-schema";
import {
  getFieldErrors,
  getNonFieldErrors,
  ErrorResponse,
  parseJsonError,
} from "@/lib/json-error-response";

export type RegisterFormState = {
  success: boolean;
  globalErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  if (!(formData instanceof FormData)) {
    return {
      success: false,
      globalErrors: ["Invalid form data"],
      fieldErrors: {},
    };
  }

  const parsedData = await registerSchema.safeParseAsync(
    Object.fromEntries(formData)
  );

  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      success: false,
      globalErrors: [],
      fieldErrors: parsedData.error.flatten().fieldErrors,
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/register`,
    {
      method: "POST",
      body: JSON.stringify(parsedData.data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.debug("res", res);
  if (!res.ok) {
    const errorResponse: ErrorResponse = parseJsonError(await res.json());
    const globalErrors = getNonFieldErrors(errorResponse);
    const fieldErrors = getFieldErrors(errorResponse);
    return {
      success: false,
      globalErrors,
      fieldErrors: Object.fromEntries(fieldErrors),
    };
  }
  const cookieHeaders = res.headers.getSetCookie();
  console.debug("cookieHeaders", cookieHeaders);
  const cookieStore = await cookies();
  cookieHeaders?.forEach((header) => {
    const parsedCookie = parseCookie(header);
    console.debug("parsedCookie", parsedCookie);
    const [cookieName] = Object.keys(parsedCookie);
    const cookieValue = parsedCookie[cookieName];
    delete parsedCookie[cookieName];
    if (cookieValue) {
      cookieStore.set(cookieName, cookieValue, {
        ...parsedCookie,
        httpOnly: true,
      });
    }
  });

  return {
    success: true,
    globalErrors: [],
    fieldErrors: {},
  };
}
