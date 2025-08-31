import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { AppContext } from 'src/app.module';
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
    findAll(locale?: string, withParentId?: string): Promise<{
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
    subcategories(category: Category, ctx: AppContext): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }[]>;
    translations(category: Category, ctx: AppContext, locale?: string): Promise<{
        name: string;
        id: string;
        localeId: string;
        description: string | null;
        categoryId: string;
    }[]>;
}
