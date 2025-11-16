"use client";

import { FragmentType, graphql } from "@/graphql";
import { CategoryTable_QueryFragmentFragmentDoc } from "@/graphql/graphql";
import { ExecutionResult } from "graphql";
import { use } from "react";

const CategoryTable_QueryFragment = graphql(`
  fragment CategoryTable_QueryFragment on Query {
    categories(parentCategoryId: $parentId) {
      id
      slug
      translations(locales: $langs) {
        id
      }
    }
  }
`);

type CategoryTableProps = {
  queryPromise: Promise<
    ExecutionResult<FragmentType<typeof CategoryTable_QueryFragment>>
  >;
};

type TCategory = typeof CategoryTable_QueryFragmentFragmentDoc;

const fallbackData: TCategory[] = [];

export function CategoryTable({ queryPromise }: CategoryTableProps) {
  const query = use(queryPromise);
}
