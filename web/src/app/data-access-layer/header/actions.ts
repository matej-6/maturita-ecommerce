"use server";
import { execute } from "@/graphql/execute";
import { HeaderQueryDocument } from "./queries";

export const getHeaderQueryData = async () => {
  return await execute(HeaderQueryDocument);
};
