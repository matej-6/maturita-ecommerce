import { CreateLocaleInput } from './create-locale.input';
declare const UpdateLocaleInput_base: import("@nestjs/common").Type<Partial<CreateLocaleInput>>;
export declare class UpdateLocaleInput extends UpdateLocaleInput_base {
    id: string;
    code: string;
    name: string;
    isActive: boolean;
}
export {};
