"use client";

import { FragmentType, graphql } from "@/graphql";
import { ExecutionResult } from "graphql";
import { use } from "react";

const CategoryParentSelectData_Fragment = graphql(`
  fragment CategoryParentSelectDataFragment on Category {
    id
    slug
  }
`);

type CategoryParentSelectProps = {
  categoriesDataPromise: Promise<
    ExecutionResult<FragmentType<typeof CategoryParentSelectData_Fragment>>
  >;
};

export function CategoryParentSelect({
  categoriesDataPromise,
}: CategoryParentSelectProps) {
  const categoriesData = use(categoriesDataPromise);

  return null;
}
