import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { GraphqlAppContext } from 'src/app.module';
export declare class CategoriesResolver {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(createCategoryInput: CreateCategoryInput): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    findAll(parentId: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    } | null>;
    updateCategory(updateCategoryInput: UpdateCategoryInput): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }>;
    removeCategory(id: string): Promise<void>;
    subcategories(category: Category, { loaders }: GraphqlAppContext): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }[]>;
    translations(category: Category, langs?: string[]): Promise<{
        id: string;
        name: string;
        locale: string;
        description: string | null;
        isActive: boolean;
        categoryId: string;
    }[]>;
    categoryName(category: Category, ctx: GraphqlAppContext): Promise<string>;
    resolveCategoryDescription(category: Category, ctx: GraphqlAppContext): Promise<string | null>;
}
