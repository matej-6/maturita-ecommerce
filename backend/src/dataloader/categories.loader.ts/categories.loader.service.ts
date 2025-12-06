import { Injectable, Scope } from '@nestjs/common';
import { Category } from 'generated/prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class CategoriesLoaderService {
  constructor(private readonly db: PrismaService) {}

  public readonly batchSubcategoriesByParentId = new DataLoader<
    number,
    Category[]
  >(async (categoryIds: number[]) => {
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
