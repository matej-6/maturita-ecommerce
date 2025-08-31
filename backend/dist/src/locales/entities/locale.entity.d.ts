import { type Locale as DbLocale } from '@prisma/client';
export declare class Locale implements Partial<DbLocale> {
    id: string;
    code: string;
    name: string;
    isActive: boolean;
}
