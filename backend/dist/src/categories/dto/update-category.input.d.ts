import { CreateCategoryInput } from './create-category.input';
declare const UpdateCategoryInput_base: import("@nestjs/common").Type<Omit<CreateCategoryInput, "translations">>;
export declare class UpdateCategoryInput extends UpdateCategoryInput_base {
    id: string;
}
export {};
