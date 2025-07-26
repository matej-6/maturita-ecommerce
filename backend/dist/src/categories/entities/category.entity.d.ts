import { Category as CategoryEntity } from '@prisma/client';
export declare class Category implements CategoryEntity {
    id: string;
    name: string;
    description: string | null;
    parentCategoryId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
