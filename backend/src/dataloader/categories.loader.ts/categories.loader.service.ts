import { Injectable, Scope } from '@nestjs/common';
import { Category } from '@prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class CategoriesLoaderService {
  constructor(private readonly db: PrismaService) {}

  public readonly batchSubcategoriesByParentId = new DataLoader<
    string,
    Category[]
  >(async (categoryIds: string[]) => {
    const subcategories = await this.db.category.findMany({
      where: {
        parentCategoryId: {
          in: categoryIds,
        },
      },
    });

    return categoryIds.map((id) =>
      subcategories.filter((subc) => subc.parentCategoryId === id),
    );
  });
}
