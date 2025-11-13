import { Role } from 'generated/prisma/enums';
import {
  CategoryFindAllQueryFilterInput,
  CategoryFindOneQueryFilterInput,
  CategoryTranslationsQueryFilter,
} from './categories.resolver.filters';

export class CategoriesServiceFindOneFilter {
  isPublic: boolean | null;
  isSetup: boolean | null;

  static fromCategoryFindOneQueryFilterInput(
    input: CategoryFindOneQueryFilterInput | null,
    userRole?: Role,
  ): CategoriesServiceFindOneFilter {
    const res = new CategoriesServiceFindOneFilter();
    res.isPublic = true;
    res.isSetup = true;
    if (userRole === 'ADMIN') {
      res.isPublic = input !== null ? input.isPublic : true;
      res.isSetup = input !== null ? input.isSetup : true;
    }
    return res;
  }
}

export class CategoriesServiceFindAllFilter {
  isPublic: boolean | null;
  isSetup: boolean | null;
  parentCategoryId: number | null;

  static fromCategoryFindAllQueryFilterInput(
    input: CategoryFindAllQueryFilterInput | null,
    userRole?: Role,
  ) {
    const res = new CategoriesServiceFindAllFilter();
    res.isPublic = true;
    res.isSetup = true;
    res.parentCategoryId = null;

    if (input?.parentCategoryId != null) {
      res.parentCategoryId = input.parentCategoryId;
    }

    if (userRole === 'ADMIN') {
      res.isPublic = input == null ? true : input.isPublic;
      res.isSetup = input == null ? true : input.isSetup;
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
