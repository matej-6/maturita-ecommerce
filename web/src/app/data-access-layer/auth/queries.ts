import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE_NAME } from "@/app/lib/auth.constants";
import { authRefreshToken } from "./actions";
import { fetchBackend } from "../fetch-backend";
import { fetchGraphql } from "../fetch-graphql";
import { graphql } from "@/graphql";

export const isAdmin = cache(() => {});


const CurrentSessionQuery = graphql(`
  query CurrentSession {
      me {
          id
          email
          emailVerified
          avatar
          createdAt
          firstName
          lastName
          role
          updatedAt
      }
  }
  `)


export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();

  const authToken = cookieStore.get(AUTHENTICATION_COOKIE_NAME)?.value;
  if (!authToken) {
    throw new Error("unauthorized");
  }
  try {
    const res = await fetchGraphql(meQueryDocument)
  }
});
