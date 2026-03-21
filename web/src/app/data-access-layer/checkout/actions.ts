"use server";

import { redirect } from "next/navigation";
import { fetchBackend } from "../fetch-backend";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/app/lib/auth.constants";

export async function checkoutAction() {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  const headers: HeadersInit = {};

  if (sessionId) {
    headers["Authorization"] = "Bearer " + sessionId;
  }

  const response = await fetchBackend("/orders/create-checkout-session", {
    method: "POST",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new Error("Something went wrong. Please try again later.");
  }

  const data: { url: string } = await response.json();
  console.log(data);
  redirect(data.url);
}
