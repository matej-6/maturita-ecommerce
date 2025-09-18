import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE_NAME } from "@/app/lib/auth.constants";
import { fetchGraphql } from "../fetch-graphql";
import { FragmentType, graphql } from "@/graphql";

export const isAdmin = cache(() => {});

const MeFragment = graphql(`
  fragment MeFragment on MeResponse {
    id
    avatar
    emailVerified
    firstName
    lastName
    role
    email
  }
`);

export type CurrentSession = FragmentType<typeof MeFragment>;

const meQueryDocument = graphql(`
  query Me {
    me {
      ...MeFragment
    }
  }
`);

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();

  const authToken = cookieStore.get(AUTHENTICATION_COOKIE_NAME)?.value;
  if (!authToken) {
    throw new Error("unauthorized");
  }
  try {
    return await fetchGraphql(meQueryDocument);
  } catch (e) {
    console.log(e);
  }
});
