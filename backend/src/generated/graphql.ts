
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCategoryInput {
    name: string;
    description?: Nullable<string>;
    parentCategoryId?: Nullable<string>;
}

export class UpdateCategoryInput {
    name: string;
    description?: Nullable<string>;
    parentCategoryId?: Nullable<string>;
}

export class Category {
    __typename?: 'Category';
    id: string;
    name: string;
    description?: Nullable<string>;
    createdAt: string;
    updatedAt: string;
    subcategories: Category[];
    parentCategory?: Nullable<Category>;
    parentCategoryId?: Nullable<string>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract categories(page: number, depth?: Nullable<number>): Category[] | Promise<Category[]>;

    abstract category(id: string): Nullable<Category> | Promise<Nullable<Category>>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createCategory(createCategoryInput: CreateCategoryInput): Category | Promise<Category>;

    abstract updateCategory(id: string, updateCategoryInput: UpdateCategoryInput): Category | Promise<Category>;

    abstract removeCategory(id: string): Nullable<Category> | Promise<Nullable<Category>>;
}

export class User {
    __typename?: 'User';
    id: string;
    email: string;
    name?: Nullable<string>;
    createdAt: string;
    updatedAt: string;
}

type Nullable<T> = T | null;
