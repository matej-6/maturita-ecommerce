import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { GraphqlAppContext } from 'src/app.module';
import { I18nContext } from 'nestjs-i18n';
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
    findAll(withParentId?: string): Promise<{
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
    subcategories(category: Category, ctx: GraphqlAppContext): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentCategoryId: string | null;
    }[]>;
    translations(category: Category, ctx: GraphqlAppContext, i18n: I18nContext): Promise<{
        id: string;
        name: string;
        description: string | null;
        localeId: string;
        categoryId: string;
    }[]>;
}
