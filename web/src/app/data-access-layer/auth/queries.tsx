import "server-only";
import { cache } from "react";
import { fetchGraphql } from "../fetch-graphql";
import { getFragmentData, graphql } from "@/graphql";
import { MeFragmentFragment, Role } from "@/graphql/graphql";

export const isAdmin = cache(async () => {
  return (await getCurrentSession())?.role === Role.Admin;
});

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

const meQueryDocument = graphql(`
  query Me {
    me {
      ...MeFragment
    }
  }
`);

export const getCurrentSession = async () => {
  const res = await fetchGraphql(meQueryDocument);
  if (res.data) {
    return getFragmentData(MeFragment, res.data.me);
  }

  return null;
};

export type CurrentSession = MeFragmentFragment;
