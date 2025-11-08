import { Role } from 'generated/prisma/enums';
import {
  CategoryFindAllQueryFilterInput,
  CategoryFindOneQueryFilterInput,
  CategoryTranslationsQueryFilter,
} from './categories.resolver.filters';
import z from 'zod';

export class CategoriesServiceFindOneFilter {
  isPublic: boolean;
  isSetup: boolean;

  static fromCategoryFindOneQueryFilterInput(
    input: CategoryFindOneQueryFilterInput | null,
    userRole?: Role,
  ): CategoriesServiceFindOneFilter {
    const res = new CategoriesServiceFindOneFilter();
    res.isPublic = true;
    res.isSetup = true;
    if (userRole === 'ADMIN') {
      if (input?.isPublic != null) {
        res.isPublic = input.isPublic;
      }
      if (input?.isSetup != null) {
        res.isSetup = input.isSetup;
      }
    }
    return res;
  }
}

export class CategoriesServiceFindAllFilter {
  isPublic: boolean;
  isSetup: boolean;
  parentCategoryId: string | null;

  static fromCategoryFindAllQueryFilterInput(
    input: CategoryFindAllQueryFilterInput | null,
    userRole?: Role,
  ) {
    const res = new CategoriesServiceFindAllFilter();
    res.isPublic = true;
    res.isSetup = true;
    res.parentCategoryId = null;

    if (input?.parentCategoryId != null) {
      res.parentCategoryId = z.jwt().safeParse(res.parentCategoryId).success
        ? res.parentCategoryId
        : '*';
    }

    if (userRole === 'ADMIN') {
      if (input?.isPublic != null) {
        res.isPublic = input.isPublic;
      }
      if (input?.isSetup != null) {
        res.isSetup = input.isSetup;
      }
    }
    return res;
  }
}

export class CategoriesServiceTranslationFilter {
  locales: string[];

  static fromCategoryTranslationsQueryFilter(
    input: CategoryTranslationsQueryFilter | null,
  ) {
    const res = new CategoriesServiceTranslationFilter();
    res.locales = input?.locales || [];
    return res;
  }
}
